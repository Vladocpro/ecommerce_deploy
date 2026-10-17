// One-off migration from the original schema to v2 (variants, integer pence, enums, favorites, orders v2).
//
//   node --env-file=.env scripts/migrate-v2.mjs            dry run: validates and prints what would change
//   node --env-file=.env scripts/migrate-v2.mjs --apply    performs the migration, then runs `prisma db push`
//
// What it does:
//   Products  converted in place, ids kept: price -> pence, sale -> discountPercent, sizes -> ProductVariant
//             documents, image URLs -> {url, publicId}, "T-Shirt" -> TShirt, slug added
//   Users     kept (accounts and passwords untouched); cart emptied, legacy favorites/orders fields removed
//   Orders    deleted: their shape changed completely and the old data isn't needed
//   RateLimit emptied (lib/rateLimit.ts creates the TTL index that expires counters)
//
// Safe to run again: products that already have a slug are skipped.
// Run it when deploying the new code: the old code can't read the new data and vice versa.

import {execSync} from "node:child_process";
import {PrismaClient} from "@prisma/client";

const APPLY = process.argv.includes("--apply");
const prisma = new PrismaClient();

// Mirrors app/constants.ts and lib/slug.ts (this script runs without the TypeScript build)
const CLOTH_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SHOE_SIZES = ["UK 5.5", "UK 6", "UK 6.5", "UK 7", "UK 7.5", "UK 8", "UK 8.5", "UK 9", "UK 9.5", "UK 10", "UK 10.5", "UK 11", "UK 11.5", "UK 12", "UK 12.5"];
const ALL_SIZES = [...CLOTH_SIZES, ...SHOE_SIZES];
const CATEGORY_FROM_OLD = {"Shoes": "Shoes", "Trousers": "Trousers", "T-Shirt": "TShirt", "Jacket": "Jacket"};
const CATEGORY_LABELS = {Shoes: "Shoes", Trousers: "Trousers", TShirt: "T-Shirt", Jacket: "Jacket"};
const GENDERS = ["Men", "Women"];
const ROLES = ["Customer", "Admin"];

const slugify = (...parts) => parts.join(" ").normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const applyDiscount = (price, discountPercent) => Math.round(price * (100 - discountPercent) / 100);

// .../image/upload/v1683807118/ecommerceNike/Shoes/Nike%20Air/abc.jpg -> ecommerceNike/Shoes/Nike Air/abc
const publicIdFromUrl = (url) => {
   const match = decodeURIComponent(url).match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
   return match ? match[1] : null;
};

// ObjectIds start with a 4-byte creation timestamp
const dateFromObjectId = (id) => new Date(parseInt(id.slice(0, 8), 16) * 1000);

async function findAll(collection, filter = {}) {
   const result = await prisma.$runCommandRaw({find: collection, filter, batchSize: 10000});
   return result.cursor.firstBatch;
}

const count = async (collection, query = {}) => (await prisma.$runCommandRaw({count: collection, query})).n;

function convertProduct(doc, problems) {
   const id = doc._id.$oid;
   const where = `Product ${id} "${doc.title}"`;
   const category = CATEGORY_FROM_OLD[doc.category];
   if (!category) problems.push(`${where}: unknown category ${doc.category}`);
   if (!GENDERS.includes(doc.gender)) problems.push(`${where}: unknown gender ${doc.gender}`);
   if (!(typeof doc.price === "number" && doc.price > 0)) problems.push(`${where}: invalid price ${doc.price}`);

   const images = (doc.images ?? []).map((originalUrl) => {
      // Older uploads stored Cloudinary's http `url`; next.config.js only allows https images
      const url = originalUrl.replace(/^http:\/\/res\.cloudinary\.com\//, "https://res.cloudinary.com/");
      const publicId = publicIdFromUrl(url);
      if (!publicId) problems.push(`${where}: can't read the Cloudinary id from ${url}`);
      return {url, publicId: publicId ?? url};
   });
   if (images.length === 0) problems.push(`${where}: has no images`);

   const variants = (doc.sizes ?? []).map((size) => {
      if (!ALL_SIZES.includes(size.title)) problems.push(`${where}: unknown size ${size.title}`);
      return {size: size.title, stock: Math.max(0, Math.trunc(Number(size.quantity) || 0)), sortOrder: ALL_SIZES.indexOf(size.title)};
   });
   if (variants.length === 0) problems.push(`${where}: has no sizes`);

   const price = Math.round(doc.price * 100);
   const discountPercent = Math.min(99, Math.max(0, Math.round(Number(doc.sale) || 0)));
   return {
      id,
      title: doc.title.trim(),
      slug: slugify(doc.title, doc.gender, CATEGORY_LABELS[category] ?? doc.category),
      description: doc.description,
      price,
      discountPercent,
      finalPrice: applyDiscount(price, discountPercent),
      images,
      gender: doc.gender,
      category,
      createdAt: dateFromObjectId(id),
      variants,
   };
}

async function main() {
   console.log(APPLY ? "Applying migration\n" : "Dry run (nothing is written; pass --apply to migrate)\n");
   const problems = [];

   // --- Products --------------------------------------------------------------------------
   const allProducts = await findAll("Product");
   const migrated = allProducts.filter((doc) => typeof doc.slug === "string");
   const pending = allProducts.filter((doc) => typeof doc.slug !== "string");
   const products = pending.map((doc) => convertProduct(doc, problems));

   const slugs = new Set(migrated.map((doc) => doc.slug));
   const identities = new Set(migrated.map((doc) => `${doc.title}|${doc.gender}|${doc.category}`));
   for (const product of products) {
      if (slugs.has(product.slug)) problems.push(`Duplicate slug ${product.slug}`);
      const identity = `${product.title}|${product.gender}|${product.category}`;
      if (identities.has(identity)) problems.push(`Duplicate product ${identity}`);
      slugs.add(product.slug);
      identities.add(identity);
   }

   console.log(`Products: ${pending.length} to convert, ${migrated.length} already converted`);
   for (const product of products.slice(0, 3)) {
      console.log(`  e.g. ${product.slug}: £${(product.price / 100).toFixed(2)} -${product.discountPercent}% = ${product.finalPrice}p, ` +
          `${product.variants.length} sizes, ${product.images.length} images (${product.images[0]?.publicId})`);
   }

   // --- Users, orders, rate limits -------------------------------------------------------
   const users = await findAll("User");
   for (const user of users) {
      if (!ROLES.includes(user.role)) problems.push(`User ${user._id.$oid}: unknown role ${user.role}`);
   }
   const ordersToDelete = await count("Order");
   console.log(`Users: ${users.length} kept (carts emptied, legacy favorites/orders fields removed)`);
   console.log(`Orders: ${ordersToDelete} deleted`);
   console.log(`RateLimit: ${await count("RateLimit")} counters deleted`);

   if (problems.length > 0) {
      console.error(`\n${problems.length} problem(s), nothing was changed:\n  ${problems.join("\n  ")}`);
      process.exitCode = 1;
      return;
   }
   if (!APPLY) {
      console.log("\nNo problems found. Run again with --apply to migrate.");
      return;
   }

   // --- Apply ---------------------------------------------------------------------------
   for (const {variants, ...product} of products) {
      // Per product, so a failure leaves every product either fully old or fully new (and the script can be re-run)
      await prisma.$transaction(async (tx) => {
         await tx.$runCommandRaw({delete: "Product", deletes: [{q: {_id: {$oid: product.id}}, limit: 1}]});
         await tx.product.create({data: {...product, variants: {create: variants}}});
      }, {timeout: 20000});
   }
   console.log(`Converted ${products.length} products`);

   await prisma.$runCommandRaw({
      update: "User",
      updates: [{q: {}, u: {$set: {cart: []}, $unset: {favorites: "", orders: ""}}, multi: true}],
   });
   await prisma.$runCommandRaw({delete: "Order", deletes: [{q: {}, limit: 0}]});
   await prisma.$runCommandRaw({delete: "RateLimit", deletes: [{q: {}, limit: 0}]});
   console.log("Updated users, deleted orders and rate-limit counters");

   // Indexes from the schema (unique slug, [title, gender, category], variants, favorites, ...).
   // Only possible now: a unique index can't be built while old documents have no slug.
   // (The RateLimit TTL index isn't in the schema: lib/rateLimit.ts creates it at runtime.)
   console.log("Running prisma db push ...");
   execSync("npx prisma db push --skip-generate", {stdio: "inherit"});
   console.log("Done.");
}

main()
    .catch((error) => {
       console.error(error);
       process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());

import prisma from "../../lib/prismadb";
import {Prisma} from "@prisma/client";
import {IFiltersState, Product} from "../types";
import {isObjectId} from "../../lib/cart";
import {PRICE_RANGES, PRODUCTS_PER_PAGE} from "../constants";

// Sizes are always returned in display order
const withVariants = {variants: {orderBy: {sortOrder: "asc"}}} satisfies Prisma.ProductInclude

export type ProductPage = {products: Product[], total: number, page: number, pageCount: number}

// Filtering, sorting and pagination all happen in the database
export async function getProducts(filters: IFiltersState): Promise<ProductPage> {
   const conditions: Prisma.ProductWhereInput[] = [{archived: false}];

   if (filters.sale) {
      conditions.push({discountPercent: {gt: 0}});
   }
   if (filters.category.length > 0) {
      conditions.push({category: {in: filters.category}});
   }
   if (filters.gender.length > 0) {
      conditions.push({gender: {in: filters.gender}});
   }
   if (filters.search) {
      conditions.push({title: {contains: filters.search, mode: "insensitive"}});
   }
   const priceRanges = PRICE_RANGES.filter((range) => filters.price.includes(range.value));
   if (priceRanges.length > 0) {
      conditions.push({OR: priceRanges.map((range) => ({finalPrice: {gte: range.min, lt: range.max}}))});
   }
   if (filters.sizes.length > 0) {
      // Only sizes that are actually in stock
      conditions.push({variants: {some: {size: {in: filters.sizes}, stock: {gt: 0}}}});
   }

   // id as a tie-breaker keeps pages stable when several products share a price
   const orderBy: Prisma.ProductOrderByWithRelationInput[] =
       filters.sortBy === "Price: Low-High" ? [{finalPrice: "asc"}, {id: "asc"}]
       : filters.sortBy === "Price: High-Low" ? [{finalPrice: "desc"}, {id: "asc"}]
       : [{createdAt: "desc"}, {id: "asc"}];

   const where: Prisma.ProductWhereInput = {AND: conditions};
   const [products, total] = await Promise.all([
      prisma.product.findMany({
         where,
         orderBy,
         skip: (filters.page - 1) * PRODUCTS_PER_PAGE,
         take: PRODUCTS_PER_PAGE,
         include: withVariants,
      }),
      prisma.product.count({where}),
   ]);

   return {products, total, page: filters.page, pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))};
}

// Archived products are not shown to customers
export async function getProductBySlug(slug: string): Promise<Product | null> {
   const product = await prisma.product.findUnique({where: {slug}, include: withVariants});
   return product && !product.archived ? product : null;
}

// Supports old /store/product/<ObjectId> links so they can be redirected to the slug URL
export async function getProductSlugById(id: string): Promise<string | null> {
   if (!isObjectId(id)) return null;
   const product = await prisma.product.findUnique({where: {id}, select: {slug: true, archived: true}});
   return product && !product.archived ? product.slug : null;
}

export async function getSalesProducts(): Promise<Product[]> {
   return prisma.product.findMany({
      where: {archived: false, discountPercent: {gt: 0}},
      orderBy: {createdAt: "desc"},
      include: withVariants,
   });
}

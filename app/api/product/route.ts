import prisma from "../../../lib/prismadb";
import {NextResponse} from "next/server";
import {Category, Gender, Prisma} from "@prisma/client";
import cloudinary from "../../../lib/cloudinary";
import {requireAdmin} from "../../../lib/requireAdmin";
import {isObjectId} from "../../../lib/cart";
import {applyDiscount} from "../../../lib/money";
import {slugify} from "../../../lib/slug";
import {ALL_SIZES, CATEGORY_LABELS} from "../../constants";

// Body sent by the admin forms. Prices are in pence.
type ProductInput = {
   title: string,
   description: string,
   price: number,
   discountPercent: number,
   gender: Gender,
   category: Category,
   images: {url: string, publicId: string}[],
   variants: {size: string, stock: number}[],
}

function parseProductInput(data: any): ProductInput | null {
   const isText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0
   if (!data || !isText(data.title) || !isText(data.description)) return null
   if (!Object.values(Gender).includes(data.gender) || !Object.values(Category).includes(data.category)) return null
   if (!Number.isInteger(data.price) || data.price <= 0) return null
   if (!Number.isInteger(data.discountPercent) || data.discountPercent < 0 || data.discountPercent >= 100) return null
   if (!Array.isArray(data.images) || data.images.length === 0 || data.images.some((image: any) => !isText(image?.url) || !isText(image?.publicId))) return null
   if (!Array.isArray(data.variants) || data.variants.length === 0) return null
   if (data.variants.some((variant: any) => !ALL_SIZES.includes(variant?.size) || !Number.isInteger(variant?.stock) || variant.stock < 0)) return null
   if (new Set(data.variants.map((variant: any) => variant.size)).size !== data.variants.length) return null

   return {
      title: data.title.trim(),
      description: data.description.trim(),
      price: data.price,
      discountPercent: data.discountPercent,
      gender: data.gender,
      category: data.category,
      images: data.images.map(({url, publicId}: any) => ({url, publicId})),
      variants: data.variants.map(({size, stock}: any) => ({size, stock})),
   }
}

// Fields stored on the product itself; finalPrice and slug are always derived here, never sent by the client
function productFields(input: ProductInput) {
   return {
      title: input.title,
      slug: slugify(input.title, input.gender, CATEGORY_LABELS[input.category]),
      description: input.description,
      price: input.price,
      discountPercent: input.discountPercent,
      finalPrice: applyDiscount(input.price, input.discountPercent),
      gender: input.gender,
      category: input.category,
      images: input.images,
   }
}

const sortOrder = (size: string) => ALL_SIZES.indexOf(size)

function duplicateResponse(input: ProductInput) {
   return NextResponse.json({error: `A ${input.gender.toLowerCase()} ${CATEGORY_LABELS[input.category]} called "${input.title}" already exists`}, {status: 409})
}

// Orders keep the image URL they were bought with, so an image is only deleted when no order shows it.
// Runs after the database write: a failed cleanup leaves unused files behind, never a broken product.
async function deleteUnusedImages(images: {url: string, publicId: string}[]) {
   const unused: string[] = []
   for (const image of images) {
      const usedByOrder = await prisma.order.findFirst({where: {items: {some: {image: image.url}}}, select: {id: true}})
      if (!usedByOrder) unused.push(image.publicId)
   }
   if (unused.length === 0) return
   try {
      await cloudinary.api.delete_resources(unused)
   } catch (error) {
      console.error("Couldn't delete product images", error)
   }
}

export async function POST(req : Request) {
   const denied = await requireAdmin()
   if (denied) return denied
   const body = await req.json().catch(() => null)
   const input = parseProductInput(body?.data)
   if (!input) {
      return NextResponse.json({error: "Fill in every product field"}, {status: 400})
   }

   try {
      await prisma.product.create({
         data: {
            ...productFields(input),
            variants: {create: input.variants.map((variant) => ({...variant, sortOrder: sortOrder(variant.size)}))}
         }
      })
      return NextResponse.json({message: "You have successfully added a product!"})
   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
         return duplicateResponse(input)
      }
      console.error(error)
      return NextResponse.json({error: "Internal Server Error"}, {status: 500})
   }
}

export async function PUT(req: Request) {
   const denied = await requireAdmin()
   if (denied) return denied
   const body = await req.json().catch(() => null);
   const id: unknown = body?.data?.id
   const input = parseProductInput(body?.data)
   if (!isObjectId(id) || !input) {
      return NextResponse.json({error: "Fill in every product field"}, {status: 400})
   }

   try {
      const existing = await prisma.product.findUnique({where: {id}})
      if (!existing) {
         return NextResponse.json({error: "Product not found"}, {status: 404})
      }

      const sizes = input.variants.map((variant) => variant.size)
      await prisma.$transaction([
         prisma.product.update({
            where: {id},
            // `archived: false` restores a removed product
            data: {...productFields(input), ...(typeof body.data.archived === "boolean" ? {archived: body.data.archived} : {})}
         }),
         // Keep variant ids stable (carts point at them): update existing sizes, add new ones, drop removed ones
         ...input.variants.map((variant) => prisma.productVariant.upsert({
            where: {productId_size: {productId: id, size: variant.size}},
            create: {productId: id, ...variant, sortOrder: sortOrder(variant.size)},
            update: {stock: variant.stock, sortOrder: sortOrder(variant.size)},
         })),
         prisma.productVariant.deleteMany({where: {productId: id, size: {notIn: sizes}}}),
      ])

      const keptUrls = new Set(input.images.map((image) => image.url))
      await deleteUnusedImages(existing.images.filter((image) => !keptUrls.has(image.url)))

      return NextResponse.json({message: "You have successfully updated the product!"})
   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
         return duplicateResponse(input)
      }
      console.error(error)
      return NextResponse.json({error: "Internal Server Error"}, {status: 500})
   }
}

// Archives instead of deleting: past orders, favorites and shared links keep working,
// and the product can be restored by setting archived back to false
export async function DELETE(req: Request) {
   const denied = await requireAdmin()
   if (denied) return denied
   const body = await req.json().catch(() => null);
   const id: unknown = body?.id
   if (!isObjectId(id)) {
      return NextResponse.json({error: "Product not found"}, {status: 404})
   }

   try {
      const {count} = await prisma.product.updateMany({where: {id}, data: {archived: true}})
      if (count === 0) {
         return NextResponse.json({error: "Product not found"}, {status: 404})
      }
      return NextResponse.json({message: "The product was removed from the store"})
   } catch (e) {
      console.error(e)
      return NextResponse.json({error: "Internal Server Error"}, {status: 500})
   }
}

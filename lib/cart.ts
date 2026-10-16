import prisma from "./prismadb";
import {CartItem, CartLine} from "../app/types";

// Matches the quantity options offered on the cart page
export const MAX_ITEM_QUANTITY = 9

export function isObjectId(value: unknown): value is string {
   return typeof value === "string" && /^[a-f\d]{24}$/i.test(value)
}

// Only variant ids and quantities are accepted from the client. Everything else
// (title, price, stock, images...) is always loaded from the database.
export function parseCartItems(value: unknown): CartItem[] | null {
   if (!Array.isArray(value)) return null
   const items: CartItem[] = []
   for (const item of value) {
      const {variantId, quantity} = item ?? {}
      if (!isObjectId(variantId)) return null
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) return null
      if (items.some((existing) => existing.variantId === variantId)) return null
      items.push({variantId, quantity})
   }
   return items
}

// Joins cart items with current product data. Items whose variant was removed or
// whose product was archived are left out.
export async function hydrateCart(items: CartItem[]): Promise<CartLine[]> {
   const variants = await prisma.productVariant.findMany({
      where: {id: {in: items.map((item) => item.variantId)}, product: {archived: false}},
      include: {product: {include: {variants: {orderBy: {sortOrder: "asc"}}}}}
   })
   const variantsById = new Map(variants.map((variant) => [variant.id, variant]))
   return items.flatMap((item) => {
      const variant = variantsById.get(item.variantId)
      if (!variant) return []
      return [{variantId: variant.id, size: variant.size, stock: variant.stock, quantity: item.quantity, product: variant.product}]
   })
}

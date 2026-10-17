import {NextResponse} from "next/server";

import getCurrentUser from "../../actions/getCurrentUser";
import prisma from "../../../lib/prismadb";
import {isObjectId, MAX_ITEM_QUANTITY, parseCartItems} from "../../../lib/cart";
import {CartItem} from "../../types";

async function saveCart(userId: string, cart: CartItem[]) {
   await prisma.user.update({
      where: {id: userId},
      data: {cart: {set: cart}}
   });
}

// Add one of each selected size to the cart. Body: {product: {id}, sizes: string[]}
export async function PATCH(req: Request) {
   const currentUser = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: "Log into your account"}, {status: 401})
   }

   try {
      const body = await req.json();
      const productId: unknown = body?.product?.id;
      const sizes: unknown = body?.sizes;
      if (!isObjectId(productId) || !Array.isArray(sizes) || sizes.length === 0) {
         return NextResponse.json({error: "Choose an available size"}, {status: 400})
      }

      const wantedSizes = Array.from(new Set(sizes.filter((size): size is string => typeof size === "string")));
      const variants = await prisma.productVariant.findMany({
         where: {productId, size: {in: wantedSizes}, product: {archived: false}}
      });
      if (variants.length !== wantedSizes.length || variants.some((variant) => variant.stock === 0)) {
         return NextResponse.json({error: "Choose an available size"}, {status: 400})
      }

      const cart = [...currentUser.cart];
      for (const variant of variants) {
         const index = cart.findIndex((item) => item.variantId === variant.id);
         if (index === -1) {
            cart.push({variantId: variant.id, quantity: 1});
         } else {
            cart[index] = {...cart[index], quantity: Math.min(cart[index].quantity + 1, MAX_ITEM_QUANTITY, variant.stock)};
         }
      }

      await saveCart(currentUser.id, cart);
      return NextResponse.json({message: "Added to cart"})
   } catch (e) {
      console.error(e)
      return NextResponse.json({error: "Couldn't update your cart"}, {status: 500})
   }
}

// Replace the cart (quantity changes, removals). Body: {items: {variantId, quantity}[]}
export async function PUT(req: Request) {
   const currentUser = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: "Log into your account"}, {status: 401})
   }

   try {
      const body = await req.json();
      const items = parseCartItems(body?.items);
      if (!items) {
         return NextResponse.json({error: "Invalid cart"}, {status: 400})
      }

      const existing = await prisma.productVariant.findMany({
         where: {id: {in: items.map((item) => item.variantId)}, product: {archived: false}},
         select: {id: true}
      });
      const existingIds = new Set(existing.map((variant) => variant.id));

      await saveCart(currentUser.id, items.filter((item) => existingIds.has(item.variantId)));
      return NextResponse.json({message: "Cart updated"})
   } catch (e) {
      console.error(e)
      return NextResponse.json({error: "Couldn't update your cart"}, {status: 500})
   }
}

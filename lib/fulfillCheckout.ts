import Stripe from "stripe";
import {randomInt} from "crypto";
import {Category, Gender, Order, Prisma} from "@prisma/client";
import prisma from "./prismadb";
import {stripe} from "./stripe";

const MAX_ATTEMPTS = 3
// No 0/O or 1/I so customers can read the number out without confusion
const ORDER_NUMBER_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"

function generateOrderNumber() {
   let suffix = ""
   for (let i = 0; i < 8; i++) suffix += ORDER_NUMBER_ALPHABET[randomInt(ORDER_NUMBER_ALPHABET.length)]
   return `ECM-${suffix}`
}

// The unique index that was violated, or null for any other error
function uniqueViolation(error: unknown): string | null {
   if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return String(error.meta?.target ?? "")
   }
   return null
}

function isWriteConflict(error: unknown) {
   return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034"
}

function toAddress(session: Stripe.Checkout.Session): Prisma.AddressCreateInput | null {
   const details = session.collected_information?.shipping_details
   if (!details) return null
   const {address} = details
   return {
      name: details.name,
      line1: address.line1 ?? "",
      line2: address.line2,
      city: address.city ?? "",
      state: address.state,
      postalCode: address.postal_code ?? "",
      country: address.country ?? "",
   }
}

// Turns a paid Checkout Session into an order: saves the order, empties the cart and
// reduces stock, all in one transaction. Safe to call any number of times for the same
// session, because Stripe can deliver a webhook more than once and the success page
// also calls this in case the user gets back before the webhook does.
// Returns null while the session isn't paid yet.
export async function fulfillCheckout(sessionId: string): Promise<Order | null> {
   const existingOrder = await prisma.order.findUnique({where: {stripeSessionId: sessionId}});
   if (existingOrder) return existingOrder;

   const session = await stripe.checkout.sessions.retrieve(sessionId);
   if (session.payment_status !== "paid" || !session.client_reference_id) return null;
   const userId = session.client_reference_id;

   const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      expand: ["data.price.product"]
   });
   // Metadata was written by /api/makePayment from database values
   const items: Prisma.OrderItemCreateInput[] = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product;
      return {
         productId: product.metadata.productId,
         variantId: product.metadata.variantId,
         title: product.name,
         size: product.metadata.size,
         category: product.metadata.category as Category,
         gender: product.metadata.gender as Gender,
         image: product.images[0] ?? "",
         unitPrice: item.price?.unit_amount ?? 0,
         quantity: item.quantity ?? 0,
      };
   });

   const paymentIntentId = typeof session.payment_intent === "string"
       ? session.payment_intent
       : session.payment_intent?.id ?? session.id;

   for (let attempt = 1; ; attempt++) {
      try {
         return await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
               data: {
                  orderNumber: generateOrderNumber(),
                  userId,
                  items,
                  subtotal: session.amount_subtotal ?? 0,
                  shipping: session.shipping_cost?.amount_total ?? 0,
                  total: session.amount_total ?? 0,
                  currency: session.currency ?? "gbp",
                  stripePaymentIntentId: paymentIntentId,
                  stripeSessionId: sessionId,
                  shippingAddress: toAddress(session),
                  customerName: session.customer_details?.name ?? "",
                  customerEmail: session.customer_details?.email ?? "",
               },
            });

            await tx.user.update({
               where: {id: userId},
               data: {cart: {set: []}}
            });

            for (const item of items) {
               // Atomic: only decrements when enough stock is left, so concurrent orders can't oversell
               const updated = await tx.productVariant.updateMany({
                  where: {id: item.variantId, stock: {gte: item.quantity}},
                  data: {stock: {decrement: item.quantity}}
               });
               if (updated.count === 0) {
                  // Already paid for, so the order stands; flag it for a manual follow-up
                  console.warn(`Order ${order.orderNumber}: not enough stock left for variant ${item.variantId}`);
                  await tx.productVariant.updateMany({where: {id: item.variantId}, data: {stock: 0}});
               }
            }

            return order;
         }, {timeout: 15000});
      } catch (error) {
         const target = uniqueViolation(error)
         // Rare clash of random order numbers: try again with a new one
         if (target?.includes("orderNumber") && attempt < MAX_ATTEMPTS) continue;
         // Someone else (webhook or success page) created this order first
         if (target !== null) return prisma.order.findUnique({where: {stripeSessionId: sessionId}});
         // MongoDB aborts one of two transactions that touch the same document at once; retry it
         if (isWriteConflict(error) && attempt < MAX_ATTEMPTS) {
            const order = await prisma.order.findUnique({where: {stripeSessionId: sessionId}});
            if (order) return order;
            continue;
         }
         throw error;
      }
   }
}

// Called for charge.refunded: a fully refunded payment marks its order as refunded
export async function markOrderRefunded(charge: Stripe.Charge) {
   if (!charge.refunded || !charge.payment_intent) return
   const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id
   await prisma.order.updateMany({
      where: {stripePaymentIntentId: paymentIntentId},
      data: {status: "Refunded"}
   })
}

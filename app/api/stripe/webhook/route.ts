//@ts-nocheck
import { headers } from "next/headers"
import * as stripe from "stripe";
import Stripe from "stripe";
import * as process from "process";
import prisma from "../../../../lib/prismadb";


async function getCartItems(lineItems : any, stripe : any) {
   return new Promise((resolve, reject) => {
      let cartItems : any = [];

      lineItems?.data?.forEach(async (item : any) => {
         const product = await stripe.products.retrieve(item.price.product);
         const productId = product.metadata.productId;

         cartItems.push({
            productId,
            name: product.name,
            price: item.price.unit_amount_decimal / 100,
            quantity: item.quantity,
            image: product.images[0],
         });

         if (cartItems.length === lineItems?.data.length) {
            resolve(cartItems);
         }
      });
   });
}

export async function POST(req: Request) {
   const body = await req.text()
   const signature = headers().get("Stripe-Signature") as string
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
   })



   let event: Stripe.Event

   try {
      event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_KEY
      )
   } catch (error : any) {
      return new Response(`Webhook Error: ${error.message}`, { status: 400 })
   }

   const session = event.data.object as Stripe.Checkout.Session

   if (event.type === "checkout.session.completed") {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const orderItems = await getCartItems(lineItems, stripe)

      const date = new Date(session.created * 1000);
      const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      await prisma.order.create({
         data: {
            userId: session.client_reference_id,
            items: orderItems,
            amountSubtotal: session.amount_subtotal / 100,
            shipping: session.shipping_cost?.amount_total,
            amountTotal: session.amount_total / 100,
            date: formattedDate,
            currency: session.currency,
            paymentIntent: session.payment_intent,
            sessionId: session.id
         },
      })

      //delete items from cart
      await prisma.user.update({
         where: {
            id: session.client_reference_id
         },
         data: {
            cart: {
               set: []
            }
         }
      })
   }


   return new Response(null, { status: 200 })
}

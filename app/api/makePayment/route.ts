import getCurrentUser from "../../actions/getCurrentUser";
import {NextResponse} from "next/server";
import prisma from "../../../lib/prismadb";
import Stripe from "stripe"
import * as process from "process";

export async function POST(req: Request) {

   // @ts-ignore
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
   })
   const body = await req.json();
   const lineItems = body.items.map((item : any) => {
      return {
         price_data: {
            currency: "gbp",
            product_data: {
               name: item.title,
               images: item.images,
               metadata: {
                  productId: item.id,
               },
            },
            unit_amount: Number((item.price - ((item.price * item.sale) / 100)).toFixed(2)) * 100,
         },
         quantity: item.quantity
      }
   })

   const currentUser  = body.user;
   if (!currentUser) {
      return NextResponse.error();
   }
   try {
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         success_url: `${process.env.NEXTAUTH_URL}/successfulPayment?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${process.env.NEXTAUTH_URL}/declinedPayment`,
         // @ts-ignore
         customer_email: currentUser.email,
         client_reference_id: currentUser.id,
         mode: "payment",
         // metadata: { body },
         shipping_options: [{
            shipping_rate: process.env.STRIPE_SHIPPING_RATE
         }],
         line_items: lineItems
      })
      return NextResponse.json({url: session.url})
   } catch (e) {
      console.log(e)
   }
}

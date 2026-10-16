import Stripe from "stripe";
import {stripe} from "../../../../lib/stripe";
import {fulfillCheckout, markOrderRefunded} from "../../../../lib/fulfillCheckout";

export async function POST(req: Request) {
   const body = await req.text()
   const signature = req.headers.get("Stripe-Signature")
   if (!signature) {
      return new Response("Missing Stripe-Signature header", {status: 400})
   }

   let event: Stripe.Event
   try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_KEY as string)
   } catch (error: any) {
      return new Response(`Webhook Error: ${error.message}`, {status: 400})
   }

   try {
      if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
         await fulfillCheckout(event.data.object.id)
      }
      if (event.type === "charge.refunded") {
         await markOrderRefunded(event.data.object)
      }
   } catch (error) {
      // A non-2xx response makes Stripe retry later, which is safe because both handlers are idempotent
      console.error(`Failed to handle ${event.type} ${event.id}`, error)
      return new Response("Unable to handle event", {status: 500})
   }

   return new Response(null, {status: 200})
}

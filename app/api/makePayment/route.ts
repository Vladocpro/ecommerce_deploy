import {NextResponse} from "next/server";
import Stripe from "stripe";
import prisma from "../../../lib/prismadb";
import {stripe} from "../../../lib/stripe";
import getCurrentUser from "../../actions/getCurrentUser";
import {parseCartItems} from "../../../lib/cart";

// Body: {items: {variantId, quantity}[]}
export async function POST(req: Request) {
   // The buyer comes from the session cookie, never from the request body
   const currentUser = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: "Log into your account"}, {status: 401});
   }

   const body = await req.json().catch(() => null);
   const items = parseCartItems(body?.items);
   if (!items || items.length === 0) {
      return NextResponse.json({error: "Your cart is empty or invalid"}, {status: 400});
   }

   try {
      const variants = await prisma.productVariant.findMany({
         where: {id: {in: items.map((item) => item.variantId)}},
         include: {product: true}
      });
      const variantsById = new Map(variants.map((variant) => [variant.id, variant]));

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      for (const item of items) {
         const variant = variantsById.get(item.variantId);
         if (!variant || variant.product.archived) {
            return NextResponse.json({error: "A product in your cart is no longer available"}, {status: 409});
         }
         if (variant.stock < item.quantity) {
            return NextResponse.json({error: `Only ${variant.stock} left of ${variant.product.title} in size ${variant.size}`}, {status: 409});
         }

         lineItems.push({
            price_data: {
               currency: "gbp",
               product_data: {
                  name: variant.product.title,
                  images: variant.product.images.slice(0, 1).map((image) => image.url),
                  // Read back by fulfillCheckout to build the order
                  metadata: {productId: variant.product.id, variantId: variant.id, size: variant.size, category: variant.product.category, gender: variant.product.gender},
               },
               // Already in pence, and always from the database
               unit_amount: variant.product.finalPrice,
            },
            quantity: item.quantity
         });
      }

      // No payment_method_types: Stripe then offers every method enabled in the dashboard (Apple Pay, Google Pay, ...)
      const session = await stripe.checkout.sessions.create({
         success_url: `${process.env.NEXTAUTH_URL}/successfulPayment?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${process.env.NEXTAUTH_URL}/declinedPayment`,
         customer_email: currentUser.email ?? undefined,
         client_reference_id: currentUser.id,
         mode: "payment",
         // Physical goods: ask where to send them
         shipping_address_collection: {allowed_countries: ["GB"]},
         shipping_options: [{
            shipping_rate: process.env.STRIPE_SHIPPING_RATE
         }],
         line_items: lineItems
      });

      return NextResponse.json({url: session.url});
   } catch (error) {
      console.error(error);
      return NextResponse.json({error: "Couldn't start checkout, please try again"}, {status: 500});
   }
}

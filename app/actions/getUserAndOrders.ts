import getCurrentUser from "./getCurrentUser";
import prisma from "./../../lib/prismadb";
import {fulfillCheckout} from "../../lib/fulfillCheckout";

export async function getUserAndOrders() {
   const user = await getCurrentUser()

   if(user === null) return undefined
   const orders = await prisma.order.findMany({
      where: {
         userId: user.id
      },
      orderBy: {createdAt: "desc"}
   });
   return {
      user,
      orders
   }
}

export async function getUserAndOrder(sessionId : string | undefined) {
   const user = await getCurrentUser()

   if(user === null) return undefined
   if(typeof sessionId !== "string" || !sessionId.startsWith("cs_")) return {error: "Access Denied"}

   try {
      // Stripe often redirects here before the webhook arrives, so create the order now if needed
      const order = await fulfillCheckout(sessionId)
      if(order === null) return {pending: true}
      if(user.id !== order.userId) {
         return {error: "Access Denied, log into your account"}
      }
      return {
         user,
         order
      }
   } catch (error) {
      console.error(error)
      return {error: "Access Denied"}
   }
}

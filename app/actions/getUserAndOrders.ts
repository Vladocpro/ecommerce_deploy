import getCurrentUser from "./getCurrentUser";
import {Order} from "../types";
import prisma from "./../../lib/prismadb";

export async function getUserAndOrders() {
   const user = await getCurrentUser()

   if(user === null) return undefined
   const orders: Order[] = await prisma.order.findMany({
      where: {
         userId: user.id
      }
   });
   return {
      user,
      orders: orders.reverse()
   }
}

export async function getUserAndOrder(sessionId : string) {
   const user = await getCurrentUser()

   if(user === null) return undefined

   const order = await prisma.order.findUnique({
      where: {
         // @ts-ignore
         sessionId: sessionId
      }
   })
   if(user.id !== order?.userId) {
      return {error: "Access Denied, log into your account"}

   }
   return {
      user,
      order
   }
}

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
      orders
   }
}

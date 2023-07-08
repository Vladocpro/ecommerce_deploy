import prisma from "../../lib/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getUsersInfo() {
   try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
         return [];
      }

      const products = await prisma.product.findMany({
         where: {
            id: {
               // @ts-ignore
               in: [...(currentUser.favorites || [])]
            }
         }
      });

      return products;
   } catch (error: any) {
      throw new Error(error);
   }
}

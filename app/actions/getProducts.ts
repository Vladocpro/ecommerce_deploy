import prisma from "../../lib/prismadb";
import {Product} from "@prisma/client";


export async function getProducts() {
   try {
      const products: Product[] = await prisma.product.findMany();
      return products;
   } catch (error: any) {
      throw new Error(error);
   }
}


export  async function getProductById(productId: string) {
   try {
      const product : Product | null = await prisma.product.findUnique({
         where: {
            id: productId
         }
      });
      return product!
   } catch (error: any) {
      throw new Error(error);
   }
}

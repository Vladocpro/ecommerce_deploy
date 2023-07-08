import prisma from "../../../lib/prismadb";
import {NextResponse} from "next/server";

export async function GET() {
   try {
      const products = await prisma.product.findMany({
         where: {
            sale:  {
               gt: 0
            }
         }
      });
      return NextResponse.json(products);
   } catch (error: any) {
      console.log(error)
   }
}


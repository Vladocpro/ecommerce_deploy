import {NextResponse} from "next/server";
import prisma from "../../../../lib/prismadb";

interface IParams {
   productTitle?: string;
}

export async function GET(req : any, { params }: { params: IParams }) {
   try {
      const products = await prisma.product.findMany({
         where: {
            title: {
               contains: params.productTitle,
               mode: "insensitive",
            }
         }
      })
      return NextResponse.json(products)
   } catch (error) {
      console.log(error)
   }
}

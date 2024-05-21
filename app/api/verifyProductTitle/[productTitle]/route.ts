import prisma from "../../../../lib/prismadb";
import {NextResponse} from "next/server";

interface IParams {
   productTitle?: string;
}


export async function GET(req : any, { params }: { params: IParams }) {
   try {
      const product = await prisma.product.findFirst({
         where: {
            // @ts-ignore
            title: params.productTitle,
         }
      })
      console.log(product)

      // If product title already exists
      if(product !== null) {
         return NextResponse.json(false)
      }

      return NextResponse.json(true)
   } catch (error) {
      return NextResponse.json(error)
   }
}

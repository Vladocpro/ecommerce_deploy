import {NextResponse} from "next/server";
import prisma from "../../../../lib/prismadb";

interface IParams {
   productId?: string;
}

export async function GET(req : any, { params }: { params: IParams }, res : NextResponse) {
   try {
      const product = await prisma.product.findUnique({
         where: {
            id: params.productId
         }
      });
      return NextResponse.json(product)
   } catch (error : any) {
      console.log(error)
   }
}

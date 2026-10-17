import {NextResponse} from "next/server";
import prisma from "../../../../lib/prismadb";
import {requireAdmin} from "../../../../lib/requireAdmin";

interface IParams {
   productTitle: string;
}

// Admin product search (update/remove forms); includes archived products so they can be restored
export async function GET(req: Request, { params }: { params: Promise<IParams> }) {
   const denied = await requireAdmin()
   if (denied) return denied
   const {productTitle} = await params;
   try {
      const products = await prisma.product.findMany({
         where: {
            title: {
               contains: productTitle,
               mode: "insensitive",
            }
         },
         orderBy: {title: "asc"},
         take: 20,
         include: {variants: {orderBy: {sortOrder: "asc"}}}
      })
      return NextResponse.json(products)
   } catch (error) {
      console.error(error)
      return NextResponse.json({error: "Search failed"}, {status: 500})
   }
}

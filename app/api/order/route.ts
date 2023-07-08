import {NextResponse} from "next/server";
import prisma from "../../../lib/prismadb";
import getCurrentUser from "../../actions/getCurrentUser";

interface IParams {
   sessionId?: string;
}

export async function GET(req : any, { params }: { params: IParams }) {
   const {searchParams} = new URL(req.url)
   const sessionId = searchParams.get("sessionId");


   const user = await getCurrentUser()
   const order = await prisma.order.findUnique({
      where: {
         // @ts-ignore
         sessionId: sessionId
      }
   })
   if (order?.userId !== user?.id) {
      return new Response(`Log into your account!`, { status: 400 })
   }
   return NextResponse.json({order, user})
}

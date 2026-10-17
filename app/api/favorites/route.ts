import {NextResponse} from "next/server";
import {Prisma} from "@prisma/client";
import prisma from "../../../lib/prismadb";
import getCurrentUser from "../../actions/getCurrentUser";
import {isObjectId} from "../../../lib/cart";

export async function PATCH(req: Request) {
   const currentUser = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: "Log into your account"}, {status: 401})
   }

   const body = await req.json().catch(() => null);
   const productId: unknown = body?.id;
   if (!isObjectId(productId)) {
      return NextResponse.json({error: "Invalid product"}, {status: 400})
   }

   try {
      await prisma.favorite.create({data: {userId: currentUser.id, productId}});
      return NextResponse.json({message: "Added to Favorites"})
   } catch (e) {
      // The unique [userId, productId] index rejects duplicates, even from two requests at once
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
         return NextResponse.json({error: "It's already in your favorites"}, {status: 409})
      }
      console.error(e)
      return NextResponse.json({error: "Couldn't update your favorites"}, {status: 500})
   }
}

export async function PUT(req: Request) {
   const currentUser = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: "Log into your account"}, {status: 401})
   }

   const body = await req.json().catch(() => null);
   const productId: unknown = body?.id;
   if (!isObjectId(productId)) {
      return NextResponse.json({error: "Invalid product"}, {status: 400})
   }

   try {
      await prisma.favorite.deleteMany({where: {userId: currentUser.id, productId}});
      return NextResponse.json({message: "Item was removed from favorites"})
   } catch (e) {
      console.error(e)
      return NextResponse.json({error: "Couldn't update your favorites"}, {status: 500})
   }
}

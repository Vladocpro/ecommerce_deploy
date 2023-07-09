import {NextResponse} from "next/server";
import prisma from "../../../lib/prismadb";
import {Product} from "../../types";
import getCurrentUser from "../../actions/getCurrentUser";
export async function PATCH(req: Request) {

   const body = await req.json();

   const currentUser  = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: `Log into your account`})
   }
   let favorites = [...(currentUser.favorites || [])];
   // @ts-ignore
   if(favorites.length !== 0 && favorites.find((product : Product) => product.id === body.product.id)) {
      return NextResponse.json({error: "It's already in your favorites"})
   }
   try {
      favorites.push(body.product)
      await prisma.user.update({
         where: {
            id: currentUser.id
         },
         data: {
            favorites: {
               set: favorites
            }
         }
      });
      return NextResponse.json({message: "Added to Favorites"})
   } catch (e) {
      console.log(e)
   }
}

export async function PUT(req: Request) {

   const body = await req.json();

   // const currentUser  = body.user;
   const currentUser  = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: `Log into your account`})
   }
   try {
      const user = await prisma.user.update({
         where: {
            id: currentUser.id
         },
         data: {
            favorites: {
               set: body.products
            }
         }
      });
      return NextResponse.json({message: "Item was remove from favorites"})
   } catch (e) {
      console.log(e)
   }
}

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
   if(favorites.length !== 0 && favorites.find((product : Product) => product.id === body.id)) {
      return NextResponse.json({error: "It's already in your favorites"})
   }
   try {
      favorites.push(body.id)
      await prisma.user.update({
         where: {
            id: currentUser.id
         },
         data: {
            // @ts-ignore
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

   const currentUser  = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: `Log into your account`})
   }
   let favorites = [...(currentUser.favorites || [])];
   favorites = favorites.filter((productId) => productId !== body.id)
   try {
       await prisma.user.update({
         where: {
            id: currentUser.id
         },
         data: {
            // @ts-ignore
            favorites: {
               set: favorites
            }
         }
      });
      return NextResponse.json({message: "Item was remove from favorites"})
   } catch (e) {
      console.log(e)
   }
}

export async function GET(req: Request) {
   try {
      const currentUser  = await getCurrentUser();
      if (!currentUser) {
         return NextResponse.json({error: `Log into your account`})
      }
      let userFavorites = [...(currentUser.favorites || [])];
      const favorites = await prisma.product.findMany({
         where: {
            id: {
               // @ts-ignore
               in: userFavorites
            }
         }
      })
      return NextResponse.json(favorites)
   } catch (e) {
      console.log(e)
   }
}

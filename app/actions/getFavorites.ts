import getCurrentUser from "../actions/getCurrentUser";
import prisma from "../../lib/prismadb";


export async function getUserFavorites() {
   const currentUser  = await getCurrentUser();
   if (!currentUser) {
      return {error: `Log into your account`}
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
   return {user: currentUser, favorites: favorites}
}

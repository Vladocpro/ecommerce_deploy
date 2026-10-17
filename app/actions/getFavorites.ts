import getCurrentUser from "../actions/getCurrentUser";
import prisma from "../../lib/prismadb";

export async function getUserFavorites() {
   const currentUser = await getCurrentUser();
   if (!currentUser) {
      return {error: `Log into your account`}
   }
   const favorites = await prisma.favorite.findMany({
      where: {userId: currentUser.id, product: {archived: false}},
      orderBy: {createdAt: "desc"},
      include: {product: {include: {variants: {orderBy: {sortOrder: "asc"}}}}}
   })
   return {user: currentUser, favorites: favorites.map((favorite) => favorite.product)}
}

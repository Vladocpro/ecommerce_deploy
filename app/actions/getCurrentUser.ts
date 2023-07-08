import { getServerSession } from "next-auth/next"

import { authOptions } from "../../pages/api/auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import {User} from "@prisma/client";

export async function getSession() {
   return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
   try {
      const session = await getSession();

      if (!session?.user?.email) {
         return null;
      }

      // @ts-ignore
      const currentUser: User  = await prisma.user.findUnique({
         where: {
            email: session.user.email as string,
         }
      });

      if (!currentUser) {
         return null;
      }

      return {
         ...currentUser,
         createdAt: currentUser.createdAt.toISOString(),
         updatedAt: currentUser.updatedAt.toISOString(),
      };
   } catch (error: any) {
      return null;
   }
}


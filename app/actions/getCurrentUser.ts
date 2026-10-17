import { cache } from "react";
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../pages/api/auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import { User } from "../types";

export async function getSession() {
   return await getServerSession(authOptions)
}

// Wrapped in cache() because the header and the page both call this during one
// render; the database is only queried once per request.
const getCurrentUser = cache(async (): Promise<User | null> => {
   try {
      const session = await getSession();
      // Sessions issued before the user id was stored in the token only have an email
      const where = session?.user?.id ? { id: session.user.id }
          : session?.user?.email ? { email: session.user.email }
          : null;
      if (!where) {
         return null;
      }

      // The result goes to client components, so the password hash is never selected
      return await prisma.user.findUnique({
         where,
         select: { id: true, name: true, email: true, image: true, role: true, cart: true }
      });
   } catch (error: any) {
      return null;
   }
});

export default getCurrentUser;

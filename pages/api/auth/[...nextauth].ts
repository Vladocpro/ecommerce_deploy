import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "../../../lib/prismadb"
import { getClientIp, rateLimit } from "../../../lib/rateLimit"

const DAY_IN_SECONDS = 24 * 60 * 60

export const authOptions: AuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
      }),
      CredentialsProvider({
         name: 'credentials',
         credentials: {
            email: { label: 'email', type: 'text' },
            password: { label: 'password', type: 'password' }
         },
         async authorize(credentials, req) {
            // Limited per IP, not per email, so nobody can lock others out of the shared demo account
            const allowed = await rateLimit(`sign-in:${getClientIp(req?.headers)}`, 10, 15 * 60)
            if (!allowed) {
               throw new Error('Too many attempts, try again in 15 minutes');
            }

            if (!credentials?.email || !credentials?.password) {
               throw new Error('Invalid credentials');
            }

            const user = await prisma.user.findUnique({
               where: {
                  email: credentials.email
               }
            });

            if (!user || !user?.password) {
               throw new Error('Invalid credentials');
            }

            const isCorrectPassword = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (!isCorrectPassword) {
               throw new Error('Invalid credentials');
            }

            return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
         }
      })
   ],
   callbacks: {
      // Runs on sign-in (with `user`) and whenever the session is read
      async jwt({ token, user }) {
         if (user) {
            token.id = user.id
            token.role = user.role ?? "Customer"
         }
         return token
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.id
            session.user.role = token.role
         }
         return session
      }
   },
   pages: {
      signIn: '/',
   },
   debug: process.env.NODE_ENV === 'development',
   session: {
      strategy: "jwt",
      // Expire after a week of inactivity instead of the default 30 days; refreshed at most once a day
      maxAge: 7 * DAY_IN_SECONDS,
      updateAge: DAY_IN_SECONDS,
   },
   secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);

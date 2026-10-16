import bcrypt from "bcrypt";
import {Prisma} from "@prisma/client";
import client from "../../../../lib/prismadb";
import {NextResponse} from "next/server";
import {getClientIp, rateLimit} from "../../../../lib/rateLimit";

// Same rules as the sign-up form; the form can be bypassed, so the server checks again
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export async function POST(req: Request) {
   if (!await rateLimit(`sign-up:${getClientIp(req.headers)}`, 5, 60 * 60)) {
      return NextResponse.json({error: "Too many sign-ups, try again later"}, {status: 429})
   }
   try {
      const {email, password} = await req.json();
      if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
         return NextResponse.json({error: "Specify valid Email"}, {status: 400})
      }
      if (typeof password !== "string" || password.length < 5 || password.length > 20) {
         return NextResponse.json({error: "Password must be 5-20 characters"}, {status: 400})
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await client.user.create({
         data: {
            email,
            password: passwordHash
         }
      })
      // The session is created by NextAuth's signIn() right after this call
      return NextResponse.json({message: "User has been created"})
   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
         return NextResponse.json({error: "The email is already taken"}, {status: 409})
      }
      console.error(error)
      return NextResponse.json({error: "Couldn't create your account"}, {status: 500})
   }
}

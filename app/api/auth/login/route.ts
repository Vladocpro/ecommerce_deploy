import bcrypt from "bcrypt";
import client  from "../../../../lib/prismadb";
import {NextResponse} from "next/server";
import {SignJWT} from "jose";
import {createJWT, getJwtSecretKey} from "../../../../lib/auth";
export async function POST(req : any, res : NextResponse) {
   try {
      const body = await req.json();

      const user = await client.user.findFirst({
         where: {
            email: body.email
         }
      })

      if(!user) return NextResponse.json({error: "No user with this email"})
      // @ts-ignore
      const passwordIsValid = await bcrypt.compare(body.password, user!.password);

      if(!passwordIsValid) return NextResponse.json({error: "Incorrect password"})
      // @ts-ignore
      const token : string | undefined   = await createJWT(user)
      const {password, ...userData} = user
      return NextResponse.json({message: "Authenticated", token: token, user: userData})
   } catch (error : any) {
      console.log(error)
   }

}


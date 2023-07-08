import bcrypt from "bcrypt";
import client  from "../../../../lib/prismadb";
import {NextResponse} from "next/server";
import {createJWT} from "../../../../lib/auth";
export async function POST(req : any) {
   try {
      const body = await req.json();
      const passwordHash = await bcrypt.hash(body.password, 10);
      const user = await client.user.create({
         data: {
            email: body.email,
            password: passwordHash
         }
      })
      // @ts-ignore
      const token : string | undefined = await createJWT(user)
      const {password, ...userData} = user
      return NextResponse.json({message: "User has been created", token: token, user: userData})
   } catch (error : any) {
      console.log(error)
      if(error.meta.target === "email_1") return NextResponse.json({error: "The email is already taken"})
   }
}

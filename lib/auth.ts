import {jwtVerify, SignJWT} from "jose";
import {User} from "../app/types";

interface UserJwtPayload {
   jti: string,
   iat: number
}
export const getJwtSecretKey = () : string => {
   const secret = process.env.JWT_SECRET_KEY;
   if(!secret || secret.length === 0) {
      throw new Error('The environment variable JWT_SECRET_KEY is not set')
   }
   return secret
}

export const verifyAuth = async (token: string) => {
   try {
      const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
      return verified.payload as UserJwtPayload;
   } catch (error) {
      throw new Error('Your token has expired')

   }
}

export const createJWT = async (user: User) => {
   try {
      return await new SignJWT({id: user.id}).setExpirationTime("2h").setIssuedAt().setProtectedHeader({alg: "HS256"}).sign(new TextEncoder().encode(getJwtSecretKey()))
   } catch (error) {
      console.log(error)
   }
}

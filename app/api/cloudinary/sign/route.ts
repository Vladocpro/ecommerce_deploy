import {NextResponse} from "next/server";
import cloudinary from "../../../../lib/cloudinary";
import {requireAdmin} from "../../../../lib/requireAdmin";

// Signs a Cloudinary upload so only admins can upload images (replaces the public unsigned preset)
export async function POST(req: Request) {
   const denied = await requireAdmin()
   if (denied) return denied

   const body = await req.json().catch(() => null)
   const folder: unknown = body?.folder
   if (typeof folder !== "string" || !folder.startsWith("ecommerceNike/")) {
      return NextResponse.json({error: "Invalid upload folder"}, {status: 400})
   }

   const timestamp = Math.round(Date.now() / 1000)
   const signature = cloudinary.utils.api_sign_request({folder, timestamp}, process.env.CLOUDINARY_API_SECRET as string)

   return NextResponse.json({
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
   })
}

import prisma from "../../../../lib/prismadb";
import {NextResponse} from "next/server";
import {Category, Gender} from "@prisma/client";
import {requireAdmin} from "../../../../lib/requireAdmin";

interface IParams {
   productTitle: string;
}

// GET /api/verifyProductTitle/<title>?gender=Men&category=Shoes
// Responds true when no product uses this title in that gender + category yet.
// Checked before uploading images so a duplicate doesn't leave unused files in Cloudinary.
export async function GET(req: Request, { params }: { params: Promise<IParams> }) {
   const denied = await requireAdmin()
   if (denied) return denied
   const {productTitle} = await params;
   const {searchParams} = new URL(req.url)
   const gender = searchParams.get("gender") as Gender
   const category = searchParams.get("category") as Category
   if (!Object.values(Gender).includes(gender) || !Object.values(Category).includes(category)) {
      return NextResponse.json({error: "Choose a gender and category"}, {status: 400})
   }

   try {
      const product = await prisma.product.findUnique({
         where: {title_gender_category: {title: productTitle.trim(), gender, category}},
         select: {id: true}
      })
      return NextResponse.json(product === null)
   } catch (error) {
      console.error(error)
      return NextResponse.json({error: "Couldn't check the title"}, {status: 500})
   }
}

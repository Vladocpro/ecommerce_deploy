import bcrypt from "bcrypt";
import {NextResponse} from "next/server";
import {SignJWT} from "jose";
import {Product} from "@prisma/client";
import prisma from "../../../lib/prismadb";

export async function POST(req : any, res : NextResponse) {
   try {
      // const body = await req.json();

      // const product  = await client.product.create({
      //    data: {
      //       title: "Nike Sportswear Tech Fleece Windrunner",
      //       description: "Stay covered without losing a stitch of style in this oversized, carefree jacket. Building on the classic Windrunner, its crinkle woven fabric is lined with mesh for added comfort and easy layering. An iconic chevron shape and Futura logo provide a heritage Nike look. This product is made from 100% recycled polyester and recycled nylon fibres" +
      //           ".",
      //       price: 109.95,
      //       sizes: ["XS","S","M","L","XL","2XL","3XL"],
      //       images: [
      //          "https://res.cloudinary.com/dks9uqke3/image/upload/v1683820775/ecommerceNike/Jacket/Nike%20Sportswear%20Tech%20Fleece%20Windrunner/sportswear-tech-fleece-windrunner-hoodie-RGBjfr_ymce2d.jpg",
      //          "https://res.cloudinary.com/dks9uqke3/image/upload/v1683820782/ecommerceNike/Jacket/Nike%20Sportswear%20Tech%20Fleece%20Windrunner/sportswear-tech-fleece-windrunner-hoodie-RGBjfr_bmeye1.jpg",
      //          "https://res.cloudinary.com/dks9uqke3/image/upload/v1683820796/ecommerceNike/Jacket/Nike%20Sportswear%20Tech%20Fleece%20Windrunner/sportswear-tech-fleece-windrunner-hoodie-RGBjfr_j66fpi.jpg",
      //       ],
      //       gender: "Women",
      //       sale: 15,
      //       category: "Jacket"
      //    }
      // })
      // await client.product.updateMany({
      //
      // })
      return NextResponse.json({message: "Success"})
   } catch (error : any) {
      console.log(error)
   }
}

// export async function GET() {
//    try {
//       const products = await prisma.product.findMany();
//
//       return products;
//    } catch (error: any) {
//       throw new Error(error);
//    }
// }




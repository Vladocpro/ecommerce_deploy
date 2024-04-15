import {NextResponse} from "next/server";
import prisma from "../../../lib/prismadb";

const defaultShoesSizes = [
   {
      "title": "UK 5.5",
      "quantity": 2701
   },
   {
      "title": "UK 6",
      "quantity": 3086
   },
   {
      "title": "UK 6.5",
      "quantity": 1014
   },
   {
      "title": "UK 7",
      "quantity": 1719
   },
   {
      "title": "UK 7.5",
      "quantity": 9999
   },
   {
      "title": "UK 8",
      "quantity": 8473
   },
   {
      "title": "UK 8.5",
      "quantity": 4862
   },
   {
      "title": "UK 9",
      "quantity": 2555
   },
   {
      "title": "UK 9.5",
      "quantity": 6078
   },
   {
      "title": "UK 10",
      "quantity": 9999
   },
   {
      "title": "UK 10.5",
      "quantity": 5771
   },
   {
      "title": "UK 11",
      "quantity": 1765
   },
   {
      "title": "UK 11.5",
      "quantity": 8019
   },
   {
      "title": "UK 12",
      "quantity": 2764
   },
   {
      "title": "UK 12.5",
      "quantity": 5539
   }
]

const defaultClothSizes = [
   {
      "title": "XS",
      "quantity": 2701
   },
   {
      "title": "S",
      "quantity": 3086
   },
   {
      "title": "M",
      "quantity": 1014
   },
   {
      "title": "L",
      "quantity": 1719
   },
   {
      "title": "XL",
      "quantity": 9999
   },
   {
      "title": "2XL",
      "quantity": 8473
   },
   {
      "title": "3XL",
      "quantity": 4862
   }
]


export async function POST(req : any) {

   try {
      let body = await req.json()
      body = body.data

      let sizes = []
      if(body.category === "Shoes") {
         sizes = defaultShoesSizes
      } else {
         sizes = defaultClothSizes
      }
      const product = await prisma.product.findFirst({
         where: {
            // @ts-ignore
            title: body.title
         }
      })
      console.log(product)

      if(product !== null) {
         return new Response(`Title already exists`, { status: 403 })
      }

      await prisma.product.create({
         data: {
            title: body.title,
            description: body.description,
            price: body.price,
            sizes: sizes,
            images: body.images,
            gender: body.gender,
            sale:    body.sale,
            category: body.category
         }
      })
      return new Response(`Successfully added a Product`, { status: 200 })
   } catch (error) {
      console.log(error)
   }

}

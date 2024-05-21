import prisma from "../../../lib/prismadb";
import {NextResponse} from "next/server";
import cloudinary from "cloudinary"

export async function POST(req : any) {
   try {
      let body = await req.json()
      body = body.data
      const product = await prisma.product.findFirst({
         where: {
            // @ts-ignore
            title: body.title
         }
      })

      if(product !== null) {
         return new Response(`Title already exists`, { status: 403 })
      }

      await prisma.product.create({
         data: {
            title: body.title,
            description: body.description,
            price: body.price,
            sizes: body.sizes,
            images: body.images,
            gender: body.gender,
            sale:    body.sale,
            category: body.category
         }
      })
      return new Response(`You have successfully added a product!`, { status: 200 })
   } catch (error) {
      console.log(error)
      return new Response(`Internal Server Error`, { status: 500 })
   }
}

export async function PUT(req: Request) {
   try {
      let body = await req.json();
      body = body.data
      await prisma.product.update({
         where: {
            id: body.id
         },
         data: {
            title: body.title,
            description: body.description,
            price: body.price,
            sizes: body.sizes,
            images: body.images,
            gender: body.gender,
            sale: body.sale,
            category: body.category
         }
      });

      return NextResponse.json({message: "You have successfully updated the product!"})
   } catch (e) {
      console.log(e)
      return new Response(`Internal Server Error`, { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      const body = await req.json();
      cloudinary.v2.config({
         cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
         api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
         api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
         secure: true,
      });
     let publicIDs: string[] = []
     body.images.forEach((imageURL) => {
        const parsedUrl = imageURL.split("/")[10].split(".")[0]
        const publicID = `ecommerceNike/${body.category}/${body.name}/${parsedUrl}`
        publicIDs.push(publicID)
     })
      await cloudinary.v2.api.delete_resources(publicIDs)
      await cloudinary.v2.api.delete_folder(`ecommerceNike/${body.category}/${body.name}`)

      if(body.skipDBDelete) {
         return NextResponse.json({message: "You have successfully updated the product!"})
      }

      await prisma.product.delete({
         where: {
            id: body.id
         }
      });
      return NextResponse.json({message: "You have successfully removed the product!"})

   } catch (e) {
      console.log(e)
      return new Response(`Internal Server Error`, { status: 500 })
   }
}

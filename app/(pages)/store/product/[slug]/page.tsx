import React, {cache} from 'react';
import type {Metadata} from "next";
import {notFound, permanentRedirect} from "next/navigation";
import {getProductBySlug, getProductSlugById} from "../../../../actions/getProducts";
import ClientProduct from "../../../../components/pages/product/ClientProduct";

type Props = {
   params: Promise<{ slug: string }>
}

// cache(): generateMetadata and the page both need the product, the database is queried once per request.
const getProduct = cache(getProductBySlug)

const DESCRIPTION_LENGTH = 160

export async function generateMetadata({params}: Props): Promise<Metadata> {
   const product = await getProduct((await params).slug)
   if (!product) {
      return {title: "Product not found"}
   }
   const description = product.description.length > DESCRIPTION_LENGTH
       ? product.description.slice(0, DESCRIPTION_LENGTH - 1).trimEnd() + "…"
       : product.description

   return {
      title: product.title,
      description,
      alternates: {canonical: `/store/product/${product.slug}`},
      openGraph: {
         title: product.title,
         description,
         type: "website",
         images: product.images.slice(0, 1).map((image) => ({url: image.url, alt: product.title})),
      },
   }
}

const ProductPage = async ({params}: Props) => {
   const {slug} = await params
   const product = await getProduct(slug)

   if (!product) {
      // Links from before slugs used the product id: send them to the new URL
      const newSlug = await getProductSlugById(slug)
      if (newSlug) permanentRedirect(`/store/product/${newSlug}`)
      notFound()
   }

   return (
       <ClientProduct product={product}/>
   );
};

export default ProductPage;

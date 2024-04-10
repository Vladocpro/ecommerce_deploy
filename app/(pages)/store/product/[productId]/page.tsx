
import React from 'react';
import ClientProduct from "../../../../components/pages/product/ClientProduct";
import {getProductById} from "../../../../actions/getProducts";
import {Product} from "@prisma/client";

type Props = {
   params: {productId: string}
}

const Home = async ({params} : Props) => {
   const product: Product = await getProductById(params?.productId)

   return (
       <ClientProduct product={product} />
   );
};

export default Home;

"use client"

import React, {useEffect, useState} from 'react';
import { CldImage } from 'next-cloudinary';
import Image from "next/image";
import {getFetch,postFetch} from "../../../lib/fetcher";
import ProductLayout from "../../components/store/ProductLayout";
import {Product} from "../../types";

const Home =  () => {

   const [products, setProducts] = useState<Product[] | undefined>()

   useEffect( () => {
       getFetch("/api/salesProducts").then(data => setProducts(data)).catch(e => console.log(e));
   }, []);




   return (
       <div className=" mt-3 ">
          <div className="flex flex-col bg-black text-white">
             <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-7 relative font-medium mt-5 mx-auto ">Big Sales 15% Off</h1>
             <span className="relative  text-sm sm:text-base mobile:px-2  sm:mx-auto  text-justify w-full sm:w-2/3 mb-8 text-white">Visit our outlet stores from your couch and discover the best discounts and offers from a big selection of reduced NIKE items. Take advantage of our great trainers sales prices and add to your sneakers collection for less. Find great deals on the articles you love browsing our sportswear sales collection. It does not matter if you are a running addict, a sneakerhead or a committed yogi, thanks to our discount deals you will be able to get the best in running trainers sales, trainers markdowns and reduced training articles without breaking the bank. Order now and save with our latest NIKE articles on sale.</span>
          </div>

          <div className="Container">
             {products && <ProductLayout products={products}/>}
          </div>

       </div>
   );
};

export default Home;

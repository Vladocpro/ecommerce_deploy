"use client"

import React, {FC, useEffect, useState} from 'react';

import Image from "next/image";
import Link from "next/link";
import PriceComponent from "../PriceComponent";
import {Product} from "../../types";
import {postFetch} from "../../../lib/fetcher";
import { IFiltersState} from "../../types";
import {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";

interface ProductLayoutProps {
   products: Product[]
}

export const fillFilterObject = (filters: any) => {
   let initialBody: IFiltersState  = {
      sortBy: null,
      search: null,
      sale: false,
      price: [],
      category: [],
      gender: [],
      sizes: [],
   };
   if(!filters|| !Object.keys(filters).length) return initialBody
   for (let key in initialBody) {
      if (key in filters) {
         if(typeof filters[key] === "string" && ["price", "category","gender","sizes"].some((category) => category === key)) {
            // @ts-ignore
            initialBody[key].push(filters[key])
         } else {
            // @ts-ignore
            initialBody[key] = filters[key];
         }
      }
   }

   return initialBody
}

const ProductLayout: FC<ProductLayoutProps> = ({products}) => {

      const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
      const params = useSearchParams()
      const router = useRouter()


   useEffect(() => {
      // @ts-ignore
      postFetch("/api/filteredProducts", fillFilterObject(qs.parse(params?.toString()))).then(data => {
         setFilteredProducts(data)
      }).catch(e => console.log(e))
   }, [params]);

   if(filteredProducts.length === 0) {
      return  (
          <div className={'flex flex-col gap-1 justify-center items-center h-[70vh] w-full'}>
             <img src="/empty-box.png" alt="" className={'h-24 w-24'}/>
             <span className="text-3xl font-medium">Couldn&apos;t find the product!</span>
             <button className="bg-black text-white font-bold px-4 py-2 rounded-lg mt-6 hover:bg-gray-700" onClick={() => router.push("/store")}>Reset Filters
             </button>
          </div>
      )
   }

   return (
       <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-y-6 gap-5 text-black mb-10">
          {filteredProducts.map((product : Product) => (
              <div key={product.id} className="">
                 <Link  href={`/store/product/${product.id}`} className="w-full ">
                    <Image
                        className="w-full  object-cover pointer-events-none select-none"
                        // fill
                        priority={true}
                        height={620}
                        width={600}
                        // @ts-ignore
                        src={product.images[0]}
                        alt="Image"
                    />
                    <div className="flex flex-col text-lg font-medium cursor-pointer" >
                       <span>{product.title}</span>
                       <span className="text-gray-500 font-normal leading-4">{product.category}</span>
                       <span className="mt-2">
                    <PriceComponent product={product} showPercent={true} mobileHidePercent={true} />
                    </span>
                    </div>
                 </Link>
              </div>

          ))}
       </div>
   );
};

export default ProductLayout;

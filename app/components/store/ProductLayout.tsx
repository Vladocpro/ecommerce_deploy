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
import {fillFilterObject} from "../../constants";

interface ProductLayoutProps {
   products: Product[]
}


const ProductLayout: FC<ProductLayoutProps> = ({products}) => {
      const router = useRouter()

   if(products.length === 0) {
      return  (
          <div className={'flex flex-col gap-1 justify-center items-center h-[50vh] sm:h-[70vh] w-full'}>
             <img src="/empty-box.png" alt="" className="h-16 w-16 sm:h-24 sm:w-24"/>
             <span className="text-xl sm:text-3xl font-medium">Couldn&apos;t find the product!</span>
             <button className="bg-black text-white font-bold text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mt-2 sm:mt-6 hover:bg-gray-700" onClick={() => router.push("/store")}>Reset Filters
             </button>
          </div>
      )
   }

   return (
       <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-y-6 gap-5 text-black mb-10">
          {products.map((product : Product) => (
              <div key={product.id} className="">
                 <Link  href={`/store/product/${product.id}`} className="w-full ">
                    <Image
                        className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10 w-full  object-cover pointer-events-none select-none"
                        // fill={}
                        priority={true}
                        height={620}
                        width={600}
                        // @ts-ignore
                        onLoad={event => {
                           event.currentTarget.setAttribute('data-loaded', 'true')
                        }}
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

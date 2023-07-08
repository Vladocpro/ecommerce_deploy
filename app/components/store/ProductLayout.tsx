"use client"

import React, {FC, useEffect, useState} from 'react';

import Image from "next/image";
import Link from "next/link";
import PriceComponent from "../PriceComponent";
import {Product} from "../../types";
import {postFetch} from "../../../lib/fetcher";
import {useDispatch, useSelector} from "react-redux";
import {clearFilters, IFiltersState, setFilters} from "../../redux/slices/filters";
import {RootState} from "../../redux/store";

interface ProductLayoutProps {
   products: Product[]
}

const ProductLayout: FC<ProductLayoutProps> = ({products}) => {

      const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
      const filters = useSelector((state : RootState) => state.filters)
      const dispatch = useDispatch()


   useEffect(() => {
      return () => {
         dispatch(clearFilters())
      }
   }, []);


   useEffect(() => {
      postFetch("/api/filteredProducts", filters).then(data => {
         setFilteredProducts(data)
      }).catch(e => console.log(e))
   }, [filters]);

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

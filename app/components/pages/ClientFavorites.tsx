"use client"

import React, {FC, useState} from 'react';
import {Product} from "../../types";
import {useDispatch} from "react-redux";
import axios from "axios";
import {setSelectSizePopup} from "../../redux/slices/modals";
import Link from "next/link";
import Image from "next/image";
import PriceComponent from "../PriceComponent";
import {useRouter} from "next/navigation";
import useNotify from "../useNotify";
import EmptyState, {emptyStateButtonStyles} from "../EmptyState";
import {CATEGORY_LABELS} from "../../constants";

interface ClientFavoritesProps {
   favorites : Product[]
}

const ClientFavorites : FC<ClientFavoritesProps> = ({favorites}) => {
   const [products, setProducts] = useState<Product[]>(favorites)
   const [removingId, setRemovingId] = useState<string | null>(null)

   const dispatch = useDispatch();
   const notify = useNotify()
   const router = useRouter()


   // Only removed from the list once the server confirms, so a failed request leaves it in place
   const removeFromFav = async (id : string) => {
      if (removingId !== null) return
      setRemovingId(id)
      try {
         const response = await axios.put("/api/favorites",  {id: id})
         setProducts((prev) => prev.filter((item) => item.id !== id))
         notify.success(response.data?.message ?? "Removed from Favorites")
         router.refresh()
      } catch (error) {
         notify.requestError(error, "Couldn't remove from favorites, please try again")
      } finally {
         setRemovingId(null)
      }
   };


   if (products.length === 0) {
      return (
          <EmptyState title="You have no favorites!" className="h-[50vh] sm:h-[50vh]">
             <Link href="/store" className={emptyStateButtonStyles}>Go Shopping</Link>
          </EmptyState>
      )
   }

   return (
       <div className="Container grid grid-cols-2 lg:grid-cols-3 mt-6 w-full gap-y-6 gap-5 text-black mb-10">
          {products.map((product : Product, index: number) => (
              <div className="flex flex-col" key={product.id}>
                 <div className="relative">
                    <Link href={`/store/product/${product.slug}`} className="w-full">
                       {product.images[0] && (
                           <Image
                               className="w-full   object-cover pointer-events-none select-none"
                               // Only the first row is above the fold
                               priority={index < 3}
                               height={550}
                               width={520}
                               sizes="(min-width: 1024px) 32vw, 48vw"
                               src={product.images[0].url}
                               alt={product.title}
                           />
                       )}
                    </Link>
                       <button type="button" aria-label={`Remove ${product.title} from favorites`} disabled={removingId === product.id}
                               className="absolute sm:top-7 sm:right-7 top-2 right-2 cursor-pointer" onClick={() => removeFromFav(product.id)}>
                             <div className="relative top-1 sm:top-0 h-8 w-[34px] sm:h-12 sm:w-12 rounded-full bg-white">
                             </div>
                             <svg className="z-0 absolute h-6 sm:h-9 top-2 left-[4.5px] sm:top-[7px] sm:left-[6px]" viewBox="2 2 20 20"
                                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path
                                    d="M18.6249601,13.9195841 C21.4420597,10.993861 20.9841034,7.83916811 19.4113413,6.31906421 C17.8385792,4.79896031 14.9917823,4.33678078 13.1202917,6.31906421 C12.8304328,6.53319322 12.5518213,6.91480928 12.3339105,7.0791162 C12.1127972,6.91480928 11.8341858,6.53319322 11.5475293,6.31906421 C9.67283627,4.36222185 6.82924207,4.79896031 5.25647967,6.31906421 C3.68371727,7.83916811 3.22255889,10.993861 6.04286087,13.9195841 L12.3339105,20 C12.4336225,20 18.6249601,13.9195841 18.6249601,13.9195841 Z"
                                    fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                             </svg>
                       </button>
                 </div>
                 <div className="flex flex-col text-lg h-full mobile:text-base  font-medium">
                    <Link href={`/store/product/${product.slug}`}>{product.title}</Link>
                    <span className="text-gray-500 font-normal leading-4">{CATEGORY_LABELS[product.category]}</span>
                    <span className="my-2">
                    <PriceComponent product={product} showPercent={false} mobileHidePercent={true}/>
                    </span>
                    <div className="flex flex-col items-start justify-end h-full ">
                       <button
                           type="button"
                           className="border-2 mt-auto px-5 py-1.5 mobile:text-base mobile:px-2 mobile:py-1 rounded-2xl hover:border-gray-500 transition-all duration-200"
                           onClick={() => dispatch(setSelectSizePopup({isOpen: true, product}))}>Select Size
                       </button>
                    </div>
                 </div>
              </div>
          ))}
       </div>
   );
};

export default ClientFavorites;

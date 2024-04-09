"use client"

import React, {FC, useState} from 'react';
import {Product, User} from "../../types";
import {useDispatch} from "react-redux";
import axios from "axios";
import {setSelectSizePopup, setToastPopup, ToastPositions, ToastType} from "../../redux/slices/modals";
import Link from "next/link";
import Image from "next/image";
import PriceComponent from "../PriceComponent";

interface ClientFavoritesProps {
   user : User
}

const ClientFavorites : FC<ClientFavoritesProps> = ({user}) => {
   const [products, setProducts] = useState<Product[]>(user.favorites)
   const dispatch = useDispatch();


   const removeFromFav = async (product : Product) => {
      const newProducts = products.filter((item) => (item!.id !== product.id))
      const response = await axios.put("/api/favorites",  {products: newProducts, user: user}).catch((e) => console.log(e))
      setProducts(newProducts);
      if(response?.data.error) {
         dispatch(setToastPopup({visible: true, message: response.data.error, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 2000}))
      } else {
         dispatch(setToastPopup({visible: true, message: response?.data.message, position: ToastPositions.AUTH, type: ToastType.BLACK, duration: 2000}))
      }
   };

   if (products?.length === 0 ){
      return (
          <div></div>
      )
   }


   return (
       <div className="Container grid grid-cols-2 lg:grid-cols-3 mt-6 w-full gap-y-6 gap-5 text-black mb-10">
          {products?.map((product : Product) => (
              <div className="flex flex-col" key={product.id}>
                 <div className="relative">
                    <Link href={`/store/product/${product.id}`} className="w-full">
                       <Image
                           className="w-full   object-cover pointer-events-none select-none"
                           priority={true}
                           height={550}
                           width={520}
                           // @ts-ignore
                           src={product.images[0]}
                           alt="Image"
                       />
                    </Link>
                       <div className="absolute sm:top-7 sm:right-7 top-2 right-2 cursor-pointer" onClick={() => removeFromFav(product)}>
                             <div className="relative top-1 sm:top-0 h-8 w-[34px] sm:h-12 sm:w-12 rounded-full bg-white">
                             </div>
                             <svg className="z-0 absolute h-6 sm:h-9 top-2 left-[4.5px] sm:top-[7px] sm:left-[6px]" viewBox="2 2 20 20"
                                  xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.6249601,13.9195841 C21.4420597,10.993861 20.9841034,7.83916811 19.4113413,6.31906421 C17.8385792,4.79896031 14.9917823,4.33678078 13.1202917,6.31906421 C12.8304328,6.53319322 12.5518213,6.91480928 12.3339105,7.0791162 C12.1127972,6.91480928 11.8341858,6.53319322 11.5475293,6.31906421 C9.67283627,4.36222185 6.82924207,4.79896031 5.25647967,6.31906421 C3.68371727,7.83916811 3.22255889,10.993861 6.04286087,13.9195841 L12.3339105,20 C12.4336225,20 18.6249601,13.9195841 18.6249601,13.9195841 Z"
                                    fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                             </svg>
                       </div>
                 </div>
                 <div className="flex flex-col text-lg h-full mobile:text-base  font-medium">
                    <Link href={`/store/product/${product.id}`}>{product.title}</Link>
                    <span className="text-gray-500 font-normal leading-4">{product.category}</span>
                    <span className="my-2">
                    <PriceComponent product={product} showPercent={false} mobileHidePercent={true}/>
                    </span>
                    <div className="flex flex-col items-start justify-end h-full ">
                       <button
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

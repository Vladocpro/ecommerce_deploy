"use client"

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import Image from "next/image";
import {
   closeSelectSizePopup,
   setToastPopup,
   ToastPositions,
   ToastType
} from "../../redux/slices/modals";
import axios from "axios";

const SelectSizePopup = () => {

   const selectSizePopup  = useSelector((state : RootState) => state.modals.selectSizePopup)
   const dispatch = useDispatch()
   const [sizes, setSizes] =useState<string[]>([]);

   useEffect(() => {
      if(selectSizePopup.isOpen) setSizes([])
   }, [selectSizePopup.isOpen]);

   const addToBag = async () => {
      if(sizes.length === 0) {
         dispatch(setToastPopup({visible: true, message: "You need to select sizes", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 2000}))
         return
      }
      setSizes([])
      dispatch(closeSelectSizePopup());
      dispatch(setToastPopup({visible: true, message: "Added to Cart", position: ToastPositions.AUTH, type: ToastType.BLACK, duration: 2000}))
      await axios.patch("/api/cart", {product: selectSizePopup.product, sizes: sizes}).catch((e) => console.log(e))
   }



   return (
       <div className={`flex items-center justify-center cartPage:items-end fixed inset-0 z-20 transition-all duration-300 ${selectSizePopup.isOpen ? "visible" : "invisible opacity-0"}`}>
          <div className={`absolute inset-0 z-30 bg-[rgba(111,111,111,0.5)] transition-all duration-300 h-full w-full ${selectSizePopup.isOpen ? "visible" : "invisible opacity-0"}`} onClick={() => dispatch(closeSelectSizePopup())}/>
          <div className={`relative z-30 p-5 bg-white rounded-lg  transition-all  duration-300 ${selectSizePopup.isOpen ? "translate-y-0" : "-translate-y-32 opacity-0"}`}>
             {selectSizePopup.product === null ?
                 (<div className="h-[420px] w-[790px]"></div>)
                 :
                 (
                     <div className="flex cartPage:flex-col ">
                        <div className="h-[420px] w-[420px] cartPage:h-[200px] cartPage:w-[200px] mr-5 cartPage:mx-auto">
                           <Image
                               className="h-[420px] cartPage:h-[200px] cartPage:w-[200px]  object-cover pointer-events-none select-none"
                               priority={true}
                               height={420}
                               width={420}
                               // @ts-ignore
                               src={selectSizePopup.product.images[0]}
                               alt="Image"
                           />
                        </div>

                        <div className="flex flex-col ">
                           <div className="flex flex-col mb-4 cartPage:text-center">
                              <span className="text-2xl">{selectSizePopup.product.title}</span>
                              <span className="text-lg text-gray-500">{selectSizePopup.product.category}</span>
                           </div>
                           <ul className="grid grid-cols-3 cartPage:flex cartPage:overflow-x-scroll cartPage:overflow-y-hidden cartPage:scrollbar-hide mt-auto gap-x-6 gap-y-2.5 w-[350px] cartPage:w-[95vw] ">
                              {/*@ts-ignore*/}
                              {selectSizePopup.product.sizes.map((size : {title: string, isAvailable: boolean}, index: number) => (
                                  <li  onClick={() => {
                                     if(!size.isAvailable) return
                                     if(sizes.includes(size.title))
                                        setSizes(sizes.filter((item) => item !== size.title))
                                     else
                                        setSizes([...sizes, size.title])
                                  }}
                                       key={size.title} className={`flex items-center justify-center h-[46px] border-2 ${sizes.includes(size.title) ? "border-black" : " border-gray-300"}  ${!size.isAvailable ? " bg-gray-100 text-gray-300" : "hover:border-black cursor-pointer"}  rounded-lg  transition-all duration-100`}>
                               <span className="select-none  cartPage:w-24 cartPage:text-center">
                                  {size.title}
                               </span>
                                  </li>
                              ))}
                           </ul>

                           <button className="flex-shrink bg-black text-white rounded-full transition-all duration-200 py-[15px] mt-4 hover:bg-gray-500" onClick={() => addToBag()}>Add to Bag</button>
                        </div>

                     </div>

                 )
             }

          </div>
       </div>
   );
};

export default SelectSizePopup;

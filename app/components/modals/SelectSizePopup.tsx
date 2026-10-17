"use client"

import React, {useCallback, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import Image from "next/image";
import {closeSelectSizePopup} from "../../redux/slices/modals";
import axios from "axios";
import {useRouter} from "next/navigation";
import useNotify, {isUnauthorized} from "../useNotify";
import useDialog from "./useDialog";
import {CATEGORY_LABELS} from "../../constants";

const SelectSizePopup = () => {

   const selectSizePopup  = useSelector((state : RootState) => state.modals.selectSizePopup)
   const dispatch = useDispatch()
   const router = useRouter()
   const notify = useNotify()
   const dialogRef = useRef<HTMLDivElement | null>(null)
   const [sizes, setSizes] = useState<string[]>([]);
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
   const product = selectSizePopup.product

   const closePopup = useCallback(() => {
      dispatch(closeSelectSizePopup())
   }, [dispatch])
   useDialog(selectSizePopup.isOpen, closePopup, dialogRef)

   // Every time the popup opens it starts with no sizes selected (state adjusted during render, not in an effect)
   const [wasOpen, setWasOpen] = useState<boolean>(selectSizePopup.isOpen)
   if (selectSizePopup.isOpen !== wasOpen) {
      setWasOpen(selectSizePopup.isOpen)
      if (selectSizePopup.isOpen) setSizes([])
   }

   const toggleSize = (title: string) => {
      setSizes((prev) => prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title])
   }

   // The popup only closes (and reports success) once the server has actually added the items
   const addToBag = async () => {
      if(!product || isSubmitting) return
      if(sizes.length === 0) {
         notify.error("You need to select sizes")
         return
      }
      setIsSubmitting(true)
      try {
         const response = await axios.patch("/api/cart", {product: {id: product.id}, sizes})
         closePopup()
         notify.success(response.data?.message ?? "Added to Cart")
         router.refresh()
      } catch (error) {
         if (isUnauthorized(error)) closePopup()
         // Otherwise the popup stays open with the selection intact so the user can retry
         notify.requestError(error, "Couldn't add to cart, please try again")
      } finally {
         setIsSubmitting(false)
      }
   }


   return (
       <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="select-size-title"
            className={`flex items-center justify-center cartPage:items-end fixed inset-0 z-20 transition-all duration-300 ${selectSizePopup.isOpen ? "visible" : "invisible opacity-0"}`}>
          <div aria-hidden="true" className={`absolute inset-0 z-30 bg-[rgba(111,111,111,0.5)] transition-all duration-300 h-full w-full ${selectSizePopup.isOpen ? "visible" : "invisible opacity-0"}`} onClick={closePopup}/>
          <div className={`relative z-30 p-5 bg-white rounded-lg  transition-all  duration-300 ${selectSizePopup.isOpen ? "translate-y-0 md:scale-100 opacity-100" : "-translate-y-20 md:scale-50 opacity-0"}`}>
             {product === null ?
                 (<div className="h-[420px] w-[790px]"></div>)
                 :
                 (
                     <div className="flex cartPage:flex-col ">
                        <div className="h-[420px] w-[420px] cartPage:h-[200px] cartPage:w-[200px] mr-5 cartPage:mx-auto">
                           {product.images[0] && (
                               <Image
                                   className="h-[420px] cartPage:h-[200px] cartPage:w-[200px]  object-cover pointer-events-none select-none"
                                   height={420}
                                   width={420}
                                   sizes="(max-width: 850px) 200px, 420px"
                                   src={product.images[0].url}
                                   alt={product.title}
                               />
                           )}
                        </div>

                        <div className="flex flex-col ">
                           <div className="flex flex-col mb-4 cartPage:text-center">
                              <h2 id="select-size-title" className="text-2xl font-medium">{product.title}</h2>
                              <span className="text-lg text-gray-500">{CATEGORY_LABELS[product.category]}</span>
                           </div>
                           <div role="group" aria-label="Select sizes" className="grid grid-cols-3 cartPage:flex cartPage:overflow-x-scroll cartPage:overflow-y-hidden cartPage:scrollbar-hide mt-auto gap-x-6 gap-y-2.5 w-[350px] cartPage:w-[95vw] ">
                              {product.variants.map((variant) => (
                                  <button type="button" key={variant.id}
                                          disabled={variant.stock <= 0}
                                          aria-pressed={sizes.includes(variant.size)}
                                          onClick={() => toggleSize(variant.size)}
                                          className={`flex items-center justify-center h-[46px] border-2 ${sizes.includes(variant.size) ? "border-black" : " border-gray-300"}  ${variant.stock <= 0 ? " bg-gray-100 text-gray-300" : "hover:border-black cursor-pointer"}  rounded-lg font-medium transition-all duration-100`}>
                               <span className="select-none  cartPage:w-24 cartPage:text-center">
                                  {variant.size}
                               </span>
                                  </button>
                              ))}
                           </div>

                           <button type="button" disabled={isSubmitting} className="flex-shrink bg-black text-white rounded-full transition-all duration-200 py-[15px] mt-4 hover:bg-gray-500 font-medium" onClick={addToBag}>Add to Cart</button>
                        </div>

                     </div>

                 )
             }

          </div>
       </div>
   );
};

export default SelectSizePopup;

"use client"


import React, {FC, useMemo, useState} from 'react';
import Image from "next/image";
import {CartItem, CartLine} from "../../types";
import PriceComponent from "../PriceComponent";
import {postFetch} from "../../../lib/fetcher";
import {formatPrice} from "../../../lib/money";
import Link from "next/link";
import axios from "axios";
import DropDownSelect from "../dropdown/DropDownSelect";
import Tooltip from "../../components/Tooltip";
import {useRouter} from "next/navigation";
import useNotify from "../useNotify";
import EmptyState, {emptyStateButtonStyles} from "../EmptyState";
import {CATEGORY_LABELS, MAX_ITEM_QUANTITY} from "../../constants";


interface ClientCartProps {
   lines: CartLine[]
}

// Only variant ids and quantities are sent: the server loads prices and stock itself
const toCartItems = (lines: CartLine[]): CartItem[] => lines.map(({variantId, quantity}) => ({variantId, quantity}))

// 1..9, but never more than is in stock
const quantityOptions = (line: CartLine): number[] =>
    Array.from({length: Math.max(0, Math.min(MAX_ITEM_QUANTITY, line.stock))}, (_, index) => index + 1)

// Amounts in pence
const getTotals = (lines: CartLine[]) : {price: number, quantity: number} => {
   let quantity = 0
   const price = lines.reduce((sum, line) => {
      quantity += line.quantity;
      return sum + line.product.finalPrice * line.quantity
   }, 0)
   return {price, quantity}
}

const ClientCart : FC<ClientCartProps> = ({lines: initialLines}) => {
   const [lines, setLines] = useState<CartLine[]>(initialLines)
   const totals = useMemo(() => getTotals(lines), [lines])
   const notify = useNotify()
   const router = useRouter()

   // Optimistic: the UI updates straight away and is rolled back if the server rejects the change
   const saveCart = async (nextLines: CartLine[], successMessage?: string) => {
      const previousLines = lines
      setLines(nextLines)
      try {
         await axios.put("/api/cart", {items: toCartItems(nextLines)})
         if (successMessage) notify.success(successMessage)
         router.refresh()
      } catch (error) {
         setLines(previousLines)
         notify.requestError(error, "Couldn't update your cart, please try again")
      }
   }

   const editQuantity = (line : CartLine, quantity: number) => {
      saveCart(lines.map((item) => item.variantId === line.variantId ? {...item, quantity} : item))
   }

   const removeLine = (line : CartLine) => {
      saveCart(lines.filter((item) => item.variantId !== line.variantId), "Items removed")
   }

   const addToFavorites = async (line : CartLine) => {
      try {
         const response = await axios.patch("/api/favorites", {id: line.product.id})
         notify.success(response.data?.message ?? "Added to Favorites")
         router.refresh()
      } catch (error) {
         notify.requestError(error, "Couldn't add to favorites, please try again")
      }
   };

   const handleCheckout = async () =>{
      if(lines.length === 0) {
         notify.error("You need to add items first")
         return;
      }
      if(lines.some((line) => line.quantity > line.stock)) {
         notify.error("Some items are no longer available in that quantity, please update your cart")
         return;
      }
      try {
         const { url } = await postFetch('/api/makePayment', {items: toCartItems(lines)});
         window.location.assign(url)
      } catch (error) {
         notify.requestError(error, "Couldn't start checkout, please try again")
      }
   }


   if(lines.length === 0)  {
      return (
         <EmptyState title="Your Cart is Empty!">
            <Link href="/store" className={emptyStateButtonStyles}>Go Shopping</Link>
         </EmptyState>
      )
   }

   return (
       <div className="Container  grid lg:grid-cols-[minmax(440px,_740px)_minmax(260px,_340px)] grid-cols-1 gap-16 justify-center mt-12 pb-5">
          <div className="space-y-4">
             <div className="mb-6 text-center lg:text-left">
                <h1 className="text-2xl">Cart</h1>
                <p className="text-gray-400 block lg:hidden">{totals.quantity} {totals.quantity > 1 ? "Items" : "Item"} | <span
                    className="text-black">{formatPrice(totals.price)}</span></p>
             </div>

             {lines.map((line) => {
                const {product} = line
                const options = quantityOptions(line)
                return (
                 <div key={line.variantId} className="grid grid-cols-[150px_minmax(130px,_1fr)] mobile:grid-cols-[150px_1fr] text-lg gap-3 rounded-lg  shadow-md">
                    <Link href={`/store/product/${product.slug}`}>
                       {product.images[0] && (
                           <Image src={product.images[0].url} width={150} height={150} sizes="150px" className="w-[150px] h-[187.5px] rounded-l-lg" alt={product.title}/>
                       )}
                    </Link>

                    <div className="flex flex-col gap-2 mobile:gap-0 pr-3 pt-1 pb-2 sm:pt-1 sm:pb-1 justify-center">
                       <div className="flex flex-col sm:flex-row items-start sm:items-center text-xl mobile:text-base justify-between">
                          <Link href={`/store/product/${product.slug}`}>{product.title}</Link>
                          <PriceComponent product={product} quantity={line.quantity} showPercent={false} />
                       </div>
                       <span className="text-gray-500 mobile:text-sm">
                              {CATEGORY_LABELS[product.category]}
                       </span>

                       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4">
                             <span className="text-gray-500 mobile:w-[70px] w-[110px] mobile:text-sm">
                                 Size: {line.size}
                              </span>
                          <div className="text-gray-500 mobile:text-sm">
                             {options.length === 0 ? (
                                 <span>Quantity: {line.quantity}</span>
                             ) : (
                                 /* Controlled title, so a rolled back quantity is shown correctly */
                                 <DropDownSelect
                                     title={"Quantity: " + line.quantity}
                                     changeTittle={false}
                                     limitQuantity={line.stock}
                                     constTitle="Quantity: "
                                     containerStyles="bg-white shadow-xl z-20 px-0 -right-1"
                                     itemClick={(quantity: number) => editQuantity(line, quantity)}
                                     isExpanded={false}
                                     options={options}
                                 />
                             )}
                          </div>
                       </div>
                       {line.quantity > line.stock && (
                           <span role="status" className="text-red-700 text-base mobile:text-sm">
                              {line.stock <= 0 ? "Sold out" : `Only ${line.stock} left in this size`}
                           </span>
                       )}

                       <div className="flex gap-6 mt-3 mobile:mt-2">
                          <Tooltip text={"Add to Favorites"} ariaLabel={`Add ${product.title} to favorites`} onClick={() => addToFavorites(line)}>
                             <div className="headerSvg ml-1">
                                <svg viewBox="0 0 471.701 471.701" height={24} className="h-[24px] mobile:h-[20px]" aria-hidden="true">
                                   <path className="  cursor-pointer"
                                         d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                                </svg>
                             </div>
                          </Tooltip>
                          <Tooltip text={"Remove from Cart"} ariaLabel={`Remove ${product.title} (size ${line.size}) from cart`} onClick={() => removeLine(line)}>
                             <div className="headerSvg">
                                <svg viewBox="0 0 24 24" height={24} className="h-[24px] mobile:h-[20px]" fill="none" aria-hidden="true">
                                   <path stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5"
                                         d="M14.25 7.5v12m-4.5-12v12M5.25 6v13.5c0 1.24 1.01 2.25 2.25 2.25h9c1.24 0 2.25-1.01 2.25-2.25V5.25h2.75m-2.75 0H21m-12-3h5.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H3"/>
                                </svg>
                             </div>
                          </Tooltip>
                       </div>

                    </div>
                 </div>
                )
             })}
          </div>
          <aside className="text-lg mb-2">
             <h2 className="text-2xl">Summary</h2>
             <div>
                <div className="flex justify-between mt-4">
                   <span>Subtotal</span>
                   <span>{formatPrice(totals.price)}</span>
                </div>
                <div className="flex justify-between my-4">
                   <span>Estimated Delivery</span>
                   <span>Free</span>
                </div>
                <hr className="h-0.5 my-3 bg-black"/>
                <div className="flex justify-between">
                   <span>Total</span>
                   <span>{formatPrice(totals.price)}</span>
                </div>
                <hr className="h-0.5 my-3 bg-black"/>
             </div>


             <button type="button" className="w-full mt-4 bg-black text-white rounded-full transition-all duration-200 py-4 hover:bg-gray-500" onClick={handleCheckout}>Checkout</button>

          </aside>
       </div>
   );
};

export default ClientCart;

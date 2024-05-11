"use client"

import React, {FC, useEffect, useRef, useState} from 'react';
import {Order, User} from "../../types";
import {useRouter} from "next/navigation";
import debounce from "lodash.debounce";
import getSymbolFromCurrency from "currency-symbol-map";
import Image from "next/image";
import DropDownOrders from "../../components/dropdown/DropDownOrders";
import {ScaleLoader} from "react-spinners";

interface ClientOrdersProps {
   currentUser : User,
   userOrders : Order[]
}

const ClientOrders : FC<ClientOrdersProps> = ({currentUser, userOrders}) => {

   const [search,setSearch] = useState<string>("")
   const [sortBy,setSortBy] = useState<string>("Most Recent")
   const [orders, setOrders] = useState<Order[]>(userOrders)
   const [filteredOrders, setFilteredOrders] = useState<Order[]>(userOrders)
   const [user, setUser] = useState<User | undefined>(currentUser)
   const router = useRouter()
   const inputRef = useRef<HTMLInputElement | null>(null)


   useEffect(() => {
      const filteredOrders = orders.filter((order : Order) => order.id.toLowerCase().includes(search.toLowerCase()))
      if(sortBy === "Most Recent") {
         setFilteredOrders(filteredOrders)
      } else {
         setFilteredOrders(filteredOrders.reverse())
      }
   }, [search, sortBy]);


   const debouncedSearch = debounce((text) => {
      setSearch(text);
   }, 500);

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      debouncedSearch(e.target.value);
   }
   const handleChangeSort = (sort: string) => {
      setSortBy(sort)
   }

   if (orders === undefined || user === undefined) {
      return (
          <div className="h-full flex flex-col justify-center items-center">
             <ScaleLoader height={40} color="black"/>
          </div>
      )
   }

   if (userOrders.length === 0) {
      return (
          <div className={'flex flex-col gap-1 justify-center items-center h-full w-full'}>
             <img src="/empty-box.png" alt="" className="h-16 w-16 sm:h-24 sm:w-24"/>
             <span className="text-xl sm:text-3xl font-medium">You have no orders!</span>
             <button className="bg-black text-white font-bold text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mt-2 sm:mt-6 hover:bg-gray-700"
                     onClick={() => router.push("/store")}>Go Shopping
             </button>
          </div>
      )
   }




   return (
       <div className="Container flex flex-col gap-6 mt-5 pb-3">
          <div className="flex flex-row justify-between relative max-w-[800px] w-full  mx-auto">
             <div className="relative -left-5 mobile:w-full">
                <svg aria-hidden="true" className="absolute left-7 top-2" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                   <path stroke="currentColor" strokeWidth="1.5"
                         d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
                </svg>
                <input type="text" onChange={(e) => handleChange(e)}
                       ref={inputRef}
                       className="bg-gray-100 pl-9 pr-5 mobile:w-full outline-black focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 mx-5 py-2 rounded-full mr-10 "
                       placeholder="Search by Order"/>
             </div>
             <DropDownOrders isExpanded={false} handleChange={handleChangeSort} value={sortBy} itemStyles="px-5 hover:bg-black hover:text-white py-1 text-gray-700 font-medium"
                             containerStyles="flex flex-col min-w-max shadow-xl bg-gray-100 px-1" options={["Most Recent", "Least Recent"]}/>
          </div>

          {filteredOrders.length === 0 && (
              <div className={'flex flex-col gap-1 justify-center items-center h-[45vh] w-full'}>
                 <img src="/empty-box.png" alt="" className="h-16 w-16 sm:h-24 sm:w-24"/>
                 <span className="text-xl sm:text-3xl font-medium">Could&apos;t find the order!</span>
                 <button className="bg-black text-white font-bold text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mt-2 sm:mt-6 hover:bg-gray-700"
                         onClick={() => {
                            setSortBy("Most Recent")
                            setSearch("")
                            if(inputRef.current !== null) inputRef.current.value = ""
                         }}>Reset Filters
                 </button>
              </div>
          )}
          {filteredOrders.map((order) => (
              // @ts-ignore
              <div key={order.id} className="max-w-[800px] w-full mx-auto p-2.5 border border-gray-300 shadow-md rounded-md">
                 <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                       <span className="text-lg sm:text-xl font-medium">Order {order.id}</span>
                       <span className="text-gray-500">{order.date}</span>
                    </div>
                    <button className="hidden sm:block border-[1.5px] border-black rounded-lg px-5 py-1 bg-black text-white font-semibold"
                            onClick={() => router.push("/successfulPayment?session_id=" + order.sessionId)}>View Order
                    </button>
                 </div>
                 <div className="flex flex-col mt-3 gap-2.5">
                    {order.items.map((product: any) => (
                        <div key={product.id}
                             className="flex gap-3 sm:gap-4 rounded-lg">
                           {/*@ts-ignore*/}
                           <Image src={product.image} width={150} height={150} className="w-[100px]" alt="Image"/>

                           <div className="flex flex-col min-w-[130px] w-full pr-3  justify-center">
                               <span className="text-lg font-medium">
                                  {product.name}
                               </span>
                              <span className="text-base font-medium">
                                  {getSymbolFromCurrency(order.currency.toUpperCase())}{(product.price * product.quantity).toFixed(2)}
                               </span>
                              <span className="text-gray-500 mobile:text-sm">
                              {product.gender + " " + product.category}
                              </span>
                              <span className="text-gray-500 mobile:w-[70px] w-[110px] mobile:text-sm">
                                 Size {product.size}
                              </span>
                              <span className="text-gray-500 mobile:w-[70px] w-[110px] mobile:text-sm">
                                 Quantity {product.quantity}
                              </span>
                           </div>
                        </div>
                    ))}
                 </div>
                 <button className="block sm:hidden border-[1.5px] w-full mt-2.5 border-black rounded-lg px-5 py-1.5 bg-black text-white font-semibold"
                         onClick={() => router.push("/successfulPayment?session_id=" + order.sessionId)}>View Order
                 </button>
              </div>
          ))}
       </div>
   );
};

export default ClientOrders;

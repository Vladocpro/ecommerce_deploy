"use client"

import React, {FC, useEffect, useState} from 'react';
import {Order, User} from "../../types";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";
import {getFetch} from "../../../lib/fetcher";
import debounce from "lodash.debounce";
import getSymbolFromCurrency from "currency-symbol-map";
import Image from "next/image";

interface ClientOrdersProps {
   currentUser : User,
   userOrders : Order[]
}

const ClientOrders : FC<ClientOrdersProps> = ({currentUser, userOrders}) => {

   const [search,setSearch] = useState<string>("")
   const [orders, setOrders] = useState<Order[]>(userOrders)
   const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

   const [user, setUser] = useState<User | undefined>(currentUser)
   const dispatch = useDispatch();
   const router = useRouter()



   useEffect(() => {
      setFilteredOrders(orders?.filter((order : Order) => order.id.toLowerCase().includes(search.toUpperCase()) || order.date.toLowerCase().includes(search.toLowerCase())))
   }, [search]);


   const debouncedSearch = debounce((text) => {
      setSearch(text);
   }, 500);

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      debouncedSearch(e.target.value);
   }

   if (orders === undefined || user === undefined) {
      return (
          <div>

          </div>
      )
   }
   // console.log(orders)
   return (
       <div className="Container flex flex-col gap-6 mt-5 pb-3">
          <div className="relative">
             <svg aria-hidden="true" className="absolute left-7 top-2"  viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                <path stroke="currentColor" strokeWidth="1.5"
                      d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
             </svg>
             <input  type="text" onChange={(e) => handleChange(e)} className="bg-gray-100  pl-9 pr-5 outline-black focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 mx-5 py-2 rounded-full mr-10 " placeholder="Search by order or date"/>
          </div>

          {filteredOrders.map((order) => (
              // @ts-ignore
              <div className="flex flex-col md:flex-row justify-between border-2 border-gray-300 rounded-lg p-3 hover:border-black cursor-pointer" key={order?.id} onClick={() => router.push("/successfulPayment?session_id=" + order.sessionId)}>
                 <div className="flex flex-col gap-2 text-sm sm:text-base grow basis-[50%]">
                    <span className="md:text-lg font-medium group">Order {order.id}</span>
                    <span>Date {order.date}</span>
                    <span>Tracking number {order.tracking_number}</span>
                    <div className="flex flex-col">
                       <span>Contact info:</span>
                       <span>{user?.email}</span>
                    </div>
                    <div className="flex flex-col">
                       <span>Payment info:</span>
                       <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="text-base">{getSymbolFromCurrency(order.currency.toUpperCase())}{order.amountSubtotal}</span>
                          <span className="text-gray-500">Shipping</span>
                          <span className="text-base">{getSymbolFromCurrency(order.currency.toUpperCase())}{order.shipping}</span>
                          <span className="mt-1">Total</span>
                          <span className="text-base">{getSymbolFromCurrency(order.currency.toUpperCase())}{order.amountTotal}</span>
                       </div>
                    </div>
                 </div>
                 <div className="hidden md:flex flex-col grow basis-[40%] gap-3 mt-5">
                    {order.items.map((product : any) => (
                        <div key={"ordersPage" + product.id} className="flex justify-between items-center gap-3 sm:gap-5">
                           <Image src={product.image} alt="" width={60} height={60} className="object-cover rounded-lg border-[1px]  border-gray-300"/>

                           <div className="flex flex-col grow basis-auto justify-self-start gap-1">
                            <span className="text-sm sm:text-lg">
                              {product.name}
                            </span>
                              <span className="text-gray-500 text-sm sm:text-base">
                                 {"Quantity: " + product.quantity}
                           </span>
                           </div>

                           <div>
                              {getSymbolFromCurrency(order.currency.toUpperCase())}{(product.price * product.quantity).toFixed(2)}
                           </div>
                        </div>
                    ))}
                 </div>
              </div>
          ))}


       </div>
   );
};

export default ClientOrders;

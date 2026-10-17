"use client"

import React, {FC, useMemo, useState} from 'react';
import {Address, Order, OrderStatus} from "../../types";
import Image from "next/image";
import Link from "next/link";
import DropDownOrders from "../../components/dropdown/DropDownOrders";
import EmptyState, {emptyStateButtonStyles} from "../EmptyState";
import {formatPrice} from "../../../lib/money";
import {CATEGORY_LABELS, ORDER_STATUS_LABELS} from "../../constants";

interface ClientOrdersProps {
   userOrders : Order[]
}

const SORT_OPTIONS = ["Most Recent", "Least Recent"]

// Fixed time zone: the date is rendered on the server and again in the browser, both must agree
const dateFormat = new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London"})

const STATUS_STYLES: Record<OrderStatus, string> = {
   Paid: "bg-black text-white",
   Shipped: "bg-gray-200 text-black",
   Delivered: "bg-green-700 text-white",
   Cancelled: "bg-red-700 text-white",
   Refunded: "bg-gray-500 text-white",
}

const addressLines = (address: Address): string[] => [
   address.name,
   address.line1,
   address.line2,
   [address.city, address.state].filter(Boolean).join(", "),
   address.postalCode,
   address.country,
].filter((line): line is string => Boolean(line))

const viewOrderStyles = "border-[1.5px] border-black rounded-lg px-5 bg-black text-white font-semibold text-center"

const ClientOrders : FC<ClientOrdersProps> = ({userOrders = []}) => {

   const [search,setSearch] = useState<string>("")
   const [sortBy,setSortBy] = useState<string>("Most Recent")

   // Filtering a user's orders locally is cheap, so it's derived on render (no debounce, no effect)
   const filteredOrders = useMemo(() => {
      const query = search.trim().toLowerCase()
      const matching = userOrders.filter((order : Order) =>
          order.orderNumber.toLowerCase().includes(query) || order.items.some((item) => item.title.toLowerCase().includes(query)))
      return sortBy === "Most Recent" ? matching : [...matching].reverse()
   }, [userOrders, search, sortBy]);

   if (userOrders.length === 0) {
      return (
          <EmptyState title="You have no orders!">
             <Link href="/store" className={emptyStateButtonStyles}>Go Shopping</Link>
          </EmptyState>
      )
   }


   return (
       <div className="Container flex flex-col gap-6 mt-5 pb-3">
          <div className="flex flex-row justify-between relative max-w-[800px] w-full  mx-auto">
             <div className="relative -left-5 mobile:w-full">
                <svg aria-hidden="true" className="absolute left-7 top-2" viewBox="0 0 24 24" width="24px" height="24px" fill="none">
                   <path stroke="currentColor" strokeWidth="1.5"
                         d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                       aria-label="Search by order number or product"
                       className="bg-gray-100 pl-9 pr-5 mobile:w-full outline-black focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 mx-5 py-2 rounded-full mr-10 "
                       placeholder="Search by Order"/>
             </div>
             <DropDownOrders isExpanded={false} handleChange={setSortBy} value={sortBy} itemStyles="px-5 hover:bg-black hover:text-white py-1 text-gray-700 font-medium"
                             containerStyles="flex flex-col min-w-max shadow-xl bg-gray-100 px-1" options={SORT_OPTIONS}/>
          </div>

          {filteredOrders.length === 0 && (
              <EmptyState title="Couldn't find the order!" className="h-[45vh]">
                 <button type="button" className={emptyStateButtonStyles}
                         onClick={() => {
                            setSortBy("Most Recent")
                            setSearch("")
                         }}>Reset Filters
                 </button>
              </EmptyState>
          )}
          {filteredOrders.map((order) => {
             const viewOrderHref = "/successfulPayment?session_id=" + encodeURIComponent(order.stripeSessionId)
             const createdAt = new Date(order.createdAt)
             return (
              <div key={order.id} className="max-w-[800px] w-full mx-auto p-2.5 border border-gray-300 shadow-md rounded-md">
                 <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                       <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <h2 className="text-lg sm:text-xl font-medium">Order {order.orderNumber}</h2>
                          <span className={`text-xs font-semibold uppercase rounded-[4px] px-2 py-0.5 ${STATUS_STYLES[order.status]}`}>
                             {ORDER_STATUS_LABELS[order.status]}
                          </span>
                       </div>
                       <time dateTime={createdAt.toISOString()} className="text-gray-500">{dateFormat.format(createdAt)}</time>
                    </div>
                    <Link href={viewOrderHref} aria-label={`View order ${order.orderNumber}`} className={`hidden sm:block py-1 ${viewOrderStyles}`}>View Order</Link>
                 </div>
                 <div className="flex flex-col mt-3 gap-2.5">
                    {order.items.map((item, index) => (
                        <div key={`${item.variantId}-${index}`}
                             className="flex gap-3 sm:gap-4 rounded-lg">
                           <Image src={item.image} width={150} height={150} sizes="100px" className="w-[100px]" alt={item.title}/>

                           <div className="flex flex-col min-w-[130px] w-full pr-3  justify-center">
                               <span className="text-lg font-medium">
                                  {item.title}
                               </span>
                              <span className="text-base font-medium">
                                  {formatPrice(item.unitPrice * item.quantity, order.currency)}
                               </span>
                              <span className="text-gray-500 mobile:text-sm">
                              {item.gender + " " + CATEGORY_LABELS[item.category]}
                              </span>
                              <span className="text-gray-500 mobile:w-[70px] w-[110px] mobile:text-sm">
                                 Size {item.size}
                              </span>
                              <span className="text-gray-500 mobile:w-[70px] w-[110px] mobile:text-sm">
                                 Quantity {item.quantity}
                              </span>
                           </div>
                        </div>
                    ))}
                 </div>

                 <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-3 pt-3 border-t border-gray-200">
                    {order.shippingAddress ? (
                        <address className="not-italic text-gray-500 text-sm sm:text-base">
                           <span className="block text-black font-medium">Shipping to</span>
                           {addressLines(order.shippingAddress).map((line, index) => (
                               <span key={index} className="block">{line}</span>
                           ))}
                        </address>
                    ) : <div/>}
                    <dl className="grid grid-cols-[auto_auto] gap-x-6 sm:min-w-[200px] text-sm sm:text-base">
                       <dt className="text-gray-500">Subtotal</dt>
                       <dd className="text-right">{formatPrice(order.subtotal, order.currency)}</dd>
                       <dt className="text-gray-500">Delivery</dt>
                       <dd className="text-right">{order.shipping === 0 ? "Free" : formatPrice(order.shipping, order.currency)}</dd>
                       <dt className="font-medium">Total</dt>
                       <dd className="text-right font-medium">{formatPrice(order.total, order.currency)}</dd>
                    </dl>
                 </div>

                 <Link href={viewOrderHref} aria-label={`View order ${order.orderNumber}`} className={`block sm:hidden w-full mt-2.5 py-1.5 ${viewOrderStyles}`}>View Order</Link>
              </div>
             )
          })}
       </div>
   );
};

export default ClientOrders;

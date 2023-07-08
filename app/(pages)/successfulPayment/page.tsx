
import React from 'react';
import Image from "next/image";
import getSymbolFromCurrency from 'currency-symbol-map'
import {getUserAndOrder} from "../../actions/getUserAndOrders";
import Link from "next/link";

const HOME = async (props) => {


   const data = await getUserAndOrder(props.searchParams.session_id)

   if(data?.error) {
      return (
          <div className="Container flex flex-col gap-2 justify-center items-center h-full w-full">
             <h1 className="text-4xl text-red-600">Access Denied</h1>
             <h1 className="text-2xl text-red-500">Log into your account!</h1>
             <Link href="/" className="mt-3 text-2xl px-7 py-1 border-[2px] border-black hover:bg-black hover:text-white transition-all duration-300">Go Home</Link>
          </div>
      );
   }

   if(data === null) {
      return (
          <div></div>
      )
   }

      return (
             <div className="h-full">
                <div className="flex flex-col lg:flex-row justify-between gap-4 w-full h-full px-1">
                   <div className="flex flex-col justify-center mt-2 lg:mt-0 lg:ml-12 lg:grow lg:basis-[55%]">

                      <div className="flex gap-2 mb-5">
                         <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">
                            <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 34.988281 14.988281 A 1.0001 1.0001 0 0 0 34.171875 15.439453 L 23.970703 30.476562 L 16.679688 23.710938 A 1.0001 1.0001 0 1 0 15.320312 25.177734 L 24.316406 33.525391 L 35.828125 16.560547 A 1.0001 1.0001 0 0 0 34.988281 14.988281 z"/>
                         </svg>
                         <div className="flex flex-col text-sm sm:text-base">
                            <span>Order {data?.order.id}</span>
                            <span>Thank You</span>
                         </div>
                         <svg  viewBox="0 5 25 14" height={48}  fill="black" className="self-start ml-auto">
                            <path fill="black"  d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z"/>
                         </svg>
                      </div>


                      <div className="flex flex-col border-2 border-black rounded-lg text-sm sm:text-base p-2.5 sm:p-5 mb-4">
                         <div className="flex flex-col gap-1 sm:gap-2">
                            <span>Your order is confirmed</span>
                            <span>We have accepted your order, and we are getting it ready. Come back to this page for updates on your shipment status.</span>
                         </div>

                         <hr className="h-[2px]  bg-gray-300 my-2 sm:my-3"/>

                         <div className="flex flex-col gap-1 sm:gap-2">
                            <span>Other tracking number:</span>
                            <span>{data?.order.tracking_number}</span>
                         </div>
                      </div>

                      <div className="flex flex-col gap-1 sm:gap-2 mb-4 border-2 border-black rounded-lg text-sm sm:text-base p-2.5 sm:p-5">
                         <span>Other updates</span>
                         <span>You will get shipping and delivery updates by email and text.</span>
                      </div>

                      <div className="flex text-sm sm:text-base justify-between">
                         <button className="font-bold cursor-pointer">Need help? Contact us</button>
                         <Link href="/store">Continue Shopping</Link>
                      </div>

                   </div>

                   <div className="flex flex-col grow basis-[40%] gap-3 sm:gap-5 overflow-y-scroll sm:border-l-2 pt-5 sm:pt-8 border-gray-300 bg-gray-100 h-full pb-5 lg:pb-0 px-3 lg:px-5">
                      {data?.order.items.map((product : any) => (
                          <div key={product.id} className="flex justify-between items-center gap-3 sm:gap-5">
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
                                {getSymbolFromCurrency(data?.order.currency.toUpperCase())}{(product.price * product.quantity).toFixed(2)}
                             </div>
                          </div>
                      ))}

                      <hr className="h-[1px] bg-gray-300"/>

                      <div>
                         <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm sm:text-base">Subtotal</span>
                            <span>{getSymbolFromCurrency(data?.order.currency.toUpperCase())}{data?.order.amountSubtotal}</span>
                         </div>

                         <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm sm:text-base">Shipping</span>
                            <span>{getSymbolFromCurrency(data?.order.currency.toUpperCase())}{data?.order.shipping}</span>
                         </div>
                      </div>

                      <hr className="h-[1px] bg-gray-300"/>
                      <div className="flex justify-between items-center sm:text-lg">
                         <span>Total</span>
                         <div className="flex gap-1 items-center">
                            <span className="text-gray-400 text-sm">{data?.order.currency.toUpperCase()}</span>
                            <span>{getSymbolFromCurrency(data?.order.currency.toUpperCase())}{data?.order.amountTotal}</span>
                         </div>
                      </div>

                   </div>
                </div>
             </div>
      );

};

export default HOME;

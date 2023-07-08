"use client"


import React, {FC, useEffect, useState} from 'react';
import Image from "next/image";
import {Product, User} from "../../types";
import PriceComponent from "../PriceComponent";
import {getFetch, postFetch} from "../../../lib/fetcher";
import Link from "next/link";
import {setToastPopup, ToastPositions, ToastType} from "../../redux/slices/modals";
import axios from "axios";
import {useDispatch} from "react-redux";
import DropDownSelect from "../dropdown/DropDownSelect";
import {useRouter} from "next/navigation";


enum ButtonAction {
   REMOVEFROMCART = "RemoveFromCart",
   ADDTOFAV = "AddToFav",
}
interface ITotals {
   price: number,
   quantity: number
}
interface ClientCartProps {
    user: User
}

const ClientCart : FC<ClientCartProps> = ({user}) => {



      const dispatch = useDispatch()
      const router = useRouter()
      const [currentUser, setCurrentUser] = useState<User | null>(user)
      const [products, setProducts] = useState<Product[] | null>(user.cart)
      const [totals, setTotals] = useState<ITotals>({price: 0, quantity: 0})

      useEffect(() => {
            if(user.cart)setTotals(getTotals(user.cart))
      }, []);



      useEffect(() => {
         if(products) setTotals(getTotals(products))
      }, [products]);

      const getTotals = (tempProducts: Product[]) : {price: number, quantity: number} => {
         let counter = 0
         const totalPrice = Number(tempProducts.reduce((sum, product) => {
            // @ts-ignore
            counter+= product.quantity;
            if(product.sale === 0)  {
               // @ts-ignore
               sum += product.price * product.quantity;
            } else {
               // @ts-ignore
               sum += ((product.price - (product.price * product.sale / 100)) * product!.quantity)
            }
            return sum
         },0).toFixed(2))
         return {price: totalPrice, quantity: counter}
      }
      const removeProduct = (product : Product) : Product[]=> {
         return  products!.filter((filterProduct: Product) => {
            if(filterProduct!.id === product.id && filterProduct!.size === product.size) {

            } else  {
               return filterProduct
            }
         })
      }
      // @ts-ignore
      const editQuantity = async (product : Product, quantity: number) : Product[] => {

         const filteredProducts =  products!.reduce((newArray, filterProduct : Product ) => {
            if(filterProduct!.id === product.id && filterProduct!.size === product.size) {
               // @ts-ignore
               newArray.push({...product, quantity: quantity})
            } else  {
               // @ts-ignore
               newArray.push(filterProduct)
            }
            return newArray
         },[])
         setProducts(filteredProducts)
         await axios.put("/api/cart", {products: filteredProducts}).catch((e) => console.log(e))

      }

      const productAction = async  (action : ButtonAction, product : Product) => {
         if(!products || product === undefined) return

         if(action === ButtonAction.REMOVEFROMCART) {
            let filteredProducts = removeProduct(product)
            setProducts(filteredProducts)
            dispatch(setToastPopup({visible: true, message: "Items removed", position: ToastPositions.AUTH, type: ToastType.BLACK, duration: 1000}))
            await axios.put("/api/cart", {products: filteredProducts}).catch((e) => console.log(e))
         }
         if (action === ButtonAction.ADDTOFAV) {
            const {size,  quantity, ...originalProduct} = product
            const response = await axios.patch("/api/favorites", {product: originalProduct}).catch((e) => console.log(e))
            if(response?.data.error) {
               dispatch(setToastPopup({visible: true, message: response.data.error, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 2000}))
            } else {
               dispatch(setToastPopup({visible: true, message: response?.data.message, position: ToastPositions.AUTH, type: ToastType.BLACK, duration: 2000}))
            }
         }
      };

      const handleCheckout = async () =>{
         if(products?.length === 0 || products === null) {
            dispatch(setToastPopup({
               visible: true,
               message: "You need to add items first",
               position: ToastPositions.AUTH,
               type: ToastType.ERROR,
               duration: 2000
            }))
            return;
         }
         const  { url }  = await postFetch('/api/makePayment', {items: products, User: currentUser});
         window.location.assign(url)
      }

      if(!currentUser || !products) {
         return (
             <div>
             </div>
         )
      }

   return (
       <div className="Container  grid grid-cols-[minmax(440px,_740px)_minmax(260px,_340px)] cartPage:grid-cols-1 gap-5 justify-around mt-12 pb-3">
          <div className="space-y-4">
             <div className="mb-6 text-center sm:text-left">
                <h1 className="text-2xl">Cart</h1>
                <h1 className="text-gray-400 block sm:hidden">{totals.quantity} {totals.quantity > 1 ? "Items" : "Item"} | <span className="text-black">£{totals.price}</span></h1>
             </div>
             {products.map((product: Product, index: number) => (
                 <div key={product.id + index} className="grid grid-cols-[150px_minmax(130px,_1fr)] mobile:grid-cols-[100px_1fr] text-lg gap-3  mobile:border-[1px] mobile:rounded-lg mobile:border-gray-300">
                    <Link href={`/store/product/${product.id}`}>
                       {/*@ts-ignore*/}
                       <Image src={product.images[0]} width={150} height={150} className="mobile:w-[100px] mobile:h-[120px] rounded-lg" alt="Image"/>
                    </Link>

                    <div className="flex flex-col gap-2 mobile:gap-0 ">
                       <div className="flex items-center mobile:items-start text-xl mobile:text-base mobile:flex-col justify-between">
                          <Link href={`/store/product/${product.id}`}>{product.title}</Link>
                          <PriceComponent product={product} showPercent={false} />
                       </div>
                       <span className="text-gray-500 mobile:text-sm">
                              {product.category}
                          </span>

                       <div className="flex items-center gap-4">
                             <span className="text-gray-500 mobile:w-[70px] w-[100px] mobile:text-sm">
                                 Size: {product.size}
                              </span>
                          <div className="text-gray-500 mobile:text-sm">
                             <DropDownSelect
                                 // @ts-ignore
                                 title={"Quantity: " + product.quantity.toString()} changeTittle={true}
                                 constTitle="Quantity: "
                                 containerStyles="bg-white shadow-xl z-20 px-0"
                                 itemStyles="px-5 hover:bg-blue-200 hover:text-black"
                                 svgStyles="bg-gray-500"
                                 itemClick={(quantity: number) => editQuantity(product,quantity)}
                                 isExpanded={false}
                                 options={[1,2,3,4,5,6,7,8,9]}
                             />
                          </div>
                       </div>

                       <div className="flex gap-6 mt-3 mobile:mt-2">
                          <div className="headerSvg ml-1" onClick={() => productAction(ButtonAction.ADDTOFAV, product)}>
                             <svg  viewBox="0 0 471.701 471.701" height={24} className="h-[24px] mobile:h-[20px]"  >
                                <path  className="  cursor-pointer" d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                             </svg>
                          </div>
                          <div className="headerSvg" onClick={() => productAction(ButtonAction.REMOVEFROMCART, product)}>
                             <svg  viewBox="0 0 24 24"  height={24} className="h-[24px] mobile:h-[20px]" fill="none">
                                <path stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" d="M14.25 7.5v12m-4.5-12v12M5.25 6v13.5c0 1.24 1.01 2.25 2.25 2.25h9c1.24 0 2.25-1.01 2.25-2.25V5.25h2.75m-2.75 0H21m-12-3h5.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H3"/>
                             </svg>
                          </div>

                       </div>

                    </div>
                 </div>
             ))}
          </div>
          <aside className="text-lg mb-2">
             <h1 className="text-2xl">Summary</h1>
             <div>
                <div className="flex justify-between mt-4">
                   <span>Subtotal</span>
                   <span>£{totals.price}</span>
                </div>
                <div className="flex justify-between my-4">
                   <span>Estimated Delivery</span>
                   <span>Free</span>
                </div>
                <hr className="h-0.5 my-3 bg-black"/>
                <div className="flex justify-between">
                   <span>Total</span>
                   <span>£{totals.price}</span>
                </div>
                <hr className="h-0.5 my-3 bg-black"/>
             </div>


             <button  className="w-full mt-4 bg-black text-white rounded-full transition-all duration-200 py-4 hover:bg-gray-500" onClick={handleCheckout}>Checkout</button>

          </aside>
       </div>
   );
};

export default ClientCart;

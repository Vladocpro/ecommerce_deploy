"use client"

import React, {useEffect, useRef, useState} from 'react';
import {Product} from "@prisma/client";
import Image from "next/image";
import {useDispatch} from "react-redux";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import {setAuthPopup, setToastPopup, ToastPositions, ToastType} from "../../../../redux/slices/modals";
import PriceComponent from "../../../../components/PriceComponent";
import {usePathname, useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";
import {getFetch} from "../../../../../lib/fetcher";


const responsive = {
   tablet: {
      breakpoint: { max: 1023, min: 640 },
      partialVisibilityGutter: 35,
      items: 1
   },
   mobile: {
      breakpoint: { max: 639, min: 0 },
      partialVisibilityGutter: 0,
      items: 1
   }
};

enum ButtonAction {
   ADDTOBAG = "AddToBag",
   ADDTOFAV = "AddToFav",
}

const HOME =  () => {
   const dispatch = useDispatch()
   const ref = useRef(null);
   const [sliderImage, setSliderImage] = useState<number>(0)
   const [sizes, setSizes] =useState<string[]>([]);
   const [product, setProduct] = useState<Product | undefined>(undefined)
   const [loading, setLoading] = useState<boolean>(true)
   const router = useRouter()
   const pathname = usePathname();

   const buttonClick = async  (action : ButtonAction) => {

      if(!product) {
         dispatch(setToastPopup({visible: true, message: "Please reload the page", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
         return
      }

      if(action === ButtonAction.ADDTOBAG) {
         if(sizes.length === 0) {
            dispatch(setToastPopup({visible: true, message: "Please select your size", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            return
         }
         setSizes([])
         const response = await axios.patch("/api/cart", {product: product, sizes: sizes}).catch((e) => console.log(e))
         if(response?.data.error) {
            if(response.data.error === "Log into your account") {
               dispatch(setAuthPopup(true))
            } else {
               dispatch(setToastPopup({visible: true, message: response.data.error, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
               router.refresh()
            }
         } else {
            dispatch(setToastPopup({visible: true, message: response?.data.message, position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 2500}))
            router.refresh()
         }
      }
      if(action === ButtonAction.ADDTOFAV) {
         const response = await axios.patch("/api/favorites", {id: product.id}).catch((e) => console.log(e))
         if(response?.data.error) {
            if(response.data.error === "Log into your account") {
               dispatch(setAuthPopup(true))
            }
            dispatch(setToastPopup({visible: true, message: response.data.error, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
         } else {
            dispatch(setToastPopup({visible: true, message: response?.data.message, position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 2500}))
         }
      }
   };

   const sizeGuideRedirect = () : string => {
      switch (product?.category) {
         case "Shoes":
            return `https://www.nike.com/gb/size-fit/${product?.gender}s-footwear`
         case "T-Shirt":
            return `https://www.nike.com/gb/size-fit/${product?.gender}s-tops-alpha`
         case "Trousers":
            return `https://www.nike.com/gb/size-fit/${product?.gender}s-bottoms-alpha`
         case "Jacket":
            return `https://www.nike.com/gb/size-fit/${product?.gender}s-tops-alpha`
         default:
            break;
      }
      return  "/"
   }


   const SizeElement = ({size} : {size:  {title: string, quantity: number}}) => {

      return (
          <li  onClick={() => {
             if(size.quantity === 0) return
             if(sizes.includes(size.title))
                setSizes(sizes.filter((item) => item !== size.title))
             else
                setSizes([...sizes, size.title])
          }}
               key={size.title} className={`flex items-center justify-center h-[38px] sm:h-[48px] md:h-[54px] lg:h-[42px] xl:h-[46px] border-2 ${sizes.includes(size.title) ? "border-black" : " border-gray-300"}  ${size.quantity === 0 ? " bg-gray-100 text-gray-300" : "hover:border-black cursor-pointer"}  rounded-lg  transition-all duration-100`}>
             <span className="select-none text-sm sm:text-base">
                {size.title}
             </span>
          </li>
      )
   }

   useEffect(() => {
      if(ref.current !== null) {
         window.scrollTo({top: 0, left: 0, behavior: "smooth"});
      }
      if(pathname === null) {
         return
      }
      const productId = pathname.split("/")
      getFetch(`/api/products/${productId[productId.length-1]}`).then((response ) => {
         setProduct(response)
         setLoading(false)
      }).catch((error) => {
         if(error.response.data !== "") {
            dispatch(setToastPopup({visible: true, message: error.response.data, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
         } else {
            dispatch(setToastPopup({visible: true, message: "Internal Server Error", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
         }
      })
   }, []);


   if(loading) {
      return  (
          <div className="h-full flex flex-col justify-center items-center">
             <ScaleLoader height={40} color="black"/>
          </div>
      )
   }

   if (product === undefined || product === null) {
      return (
          <></>
      )
   }

   return (
       <div className="flex flex-col lg:flex-row justify-center lg:gap-10 xl:gap-16 lg:w-[96%] xl:w-[92%] mx-auto  my-5" ref={ref}>
          <div className="block lg:flex xl:min-w-[736px] gap-4">
             <div className="hidden lg:flex ml-auto flex-col gap-4 w-[140px]">
                {product?.images.map((image: string, index: number) => (
                    <Image src={image} key={image} priority={true}   width={140} height={140} alt="" className="object-cover cursor-pointer hover:shadow-xl hover:opacity-70 transition-all duration-200  rounded-md" onMouseEnter={() => setSliderImage(index)}/>
                ))}
             </div>

             <div className="hidden lg:block w-full lg:min-w-[482px] xl:max-w-[585px] rounded-ld shrink">
                <Image src={product?.images[0]} priority={true} width={720} height={720} alt=""  className={`object-contain rounded-lg  ${sliderImage === 0 ? "grid" : "hidden" }   grid-cols-productSizeSection xl:w-[581px] lg:w-[482px]`}/>
                <Image src={product?.images[1]} priority={true} width={720} height={720} alt=""  className={`object-contain rounded-lg  ${sliderImage === 1 ? "grid" : "hidden" }   grid-cols-productSizeSection xl:w-[581px] lg:w-[482px]`}/>
                <Image src={product?.images[2]} priority={true} width={720} height={720} alt=""  className={`object-contain rounded-lg  ${sliderImage === 2 ? "grid" : "hidden" }   grid-cols-productSizeSection xl:w-[581px] lg:w-[482px]`}/>
                <Image src={product?.images[3]} priority={true} width={720} height={720} alt=""  className={`object-contain rounded-lg  ${sliderImage === 3 ? "grid" : "hidden" }   grid-cols-productSizeSection xl:w-[581px] lg:w-[482px]`}/>
             </div>

             <div className="block lg:hidden mx-3 mb-12 w-full shrink">
                <Carousel
                    responsive={responsive}
                    swipeable={true}
                    draggable={true}
                    showDots={true}
                    partialVisbile={true}
                    ssr={true}
                    infinite={true}
                    keyBoardControl={true}
                    customTransition="all 2s"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    itemClass="carousel-item-padding-40-px">
                   {product.images.map((slide) => (
                       <Image src={slide} priority={true} key={slide} width={630} height={650} className="object-contain mx-auto select-none pointer-events-none pr-4 sm:pr-0 lg:w-[110px] xl:w-[136px]" alt=""/>
                   ))}
                </Carousel>
             </div>
          </div>

          <div className="mobile:mx-3 mx-auto lg:mx-0 mt-5 min-w-[305px] max-w-[400px] sm:max-w-[580px] md:max-w-[630px] lg:mt-0 lg:max-w-[350px] xl:max-w-[440px]">
             <div className="flex flex-col w-full text-lg font-medium" >
                <span className="text-2xl">{product?.title}</span>
                <span className="text-gray-500 font-normal">{product?.category}</span>
                <span className="mt-2">
                      {/*@ts-ignore*/}
                   <PriceComponent product={product} showPercent={true}/>
                   </span>
                <span className="font-normal mt-1 line-clamp-7 text-base">{product.description}</span>
             </div>
             <div className="text-lg font-semibold mt-4 ">
                <div className="flex justify-between">
                   <span>Select Size</span>
                   <Link  href={sizeGuideRedirect()} target="_blank" rel="noopener noreferrer" className="mr-1.5 text-gray-500 font-medium cursor-pointer">Size Guide</Link>
                </div>
                <ul className="grid grid-cols-3 gap-y-3 gap-x-5  sm:gap-y-3.5 sm:gap-x-7 md:gap-y-3.5 md:gap-x-6 lg:gap-x-[14px] xl:gap-x-6 lg:gap-y-2 xl:gap-y-2.5 mt-3 mb-6 w-full">
                   {/*@ts-ignore*/}
                   {product.sizes?.map((size : {title: string, quantity: number}, index: number) => (
                       <SizeElement size={size} key={index} />
                   ))}
                </ul>
                <div className="flex flex-col gap-y-2 w-full">
                   <button onClick={() => buttonClick(ButtonAction.ADDTOBAG)} className="bg-black text-white rounded-full transition-all duration-200 hover:bg-gray-500 py-3.5 sm:py-[18px]  ">Add to Cart</button>
                   <button onClick={() => buttonClick(ButtonAction.ADDTOFAV)} className="border-2 border-gray-300 hover:border-black transition-all duration-100 rounded-full py-3 sm:py-4 ">Add to Favorite</button>
                </div>
             </div>
          </div>
       </div>
   );
};

export default HOME;

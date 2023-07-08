"use client"

import React, {useEffect, useState} from 'react';
import {Product} from "@prisma/client";
import {useParams, useRouter} from "next/navigation";
import {getFetch, postFetch} from "../../../../../lib/fetcher";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import {clearChosenSizes, pushChosenSize} from "../../../../redux/slices/product";
import axios from "axios";
import {store} from "../../../../redux/store";
import {setToastPopup, ToastPositions, ToastType} from "../../../../redux/slices/modals";
import Slider from "../../../../components/Slider";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PriceComponent from "../../../../components/PriceComponent";
import Link from "next/link";


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

const Home =  () => {
   const params = useParams()
   const dispatch = useDispatch()
   const [product, setProduct] = useState<Product | null>(null)
   const [sliderImage, setSliderImage] = useState<number>(0)
   const [sizes, setSizes] =useState<string[]>([]);

   useEffect(() => {
        getFetch("/api/products/" + params?.productId).then((data) => setProduct(data))

   }, []);


   const buttonClick = async  (action : ButtonAction) => {

      if(!product) {
         dispatch(setToastPopup({visible: true, message: "Please reload the page", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 2000}))
         return
      }

      if(action === ButtonAction.ADDTOBAG) {
         if(sizes.length === 0) {
            dispatch(setToastPopup({visible: true, message: "You need to select sizes", position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 2000}))
            return
         }
         setSizes([])
         await axios.patch("/api/cart", {product: product, sizes: sizes}).catch((e) => console.log(e))
         dispatch(setToastPopup({visible: true, message: "Added to Cart", position: ToastPositions.AUTH, type: ToastType.BLACK, duration: 2000}))
      }
      if(action === ButtonAction.ADDTOFAV) {
         const response = await axios.patch("/api/favorites", {product: product}).catch((e) => console.log(e))
         if(response?.data.error) {
            dispatch(setToastPopup({visible: true, message: response.data.error, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 2000}))
         } else {
            dispatch(setToastPopup({visible: true, message: response?.data.message, position: ToastPositions.AUTH, type: ToastType.BLACK, duration: 2000}))
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


   const SizeElement = ({size, key} : {size:  {title: string, isAvailable: boolean}, key: number }) => {

      return (
          <li  onClick={() => {
             if(!size.isAvailable) return
             if(sizes.includes(size.title))
                setSizes(sizes.filter((item) => item !== size.title))
             else
                setSizes([...sizes, size.title])
          }}
          key={key} className={`flex items-center justify-center h-[46px] border-2 ${sizes.includes(size.title) ? "border-black" : " border-gray-300"}  ${!size.isAvailable ? " bg-gray-100 text-gray-300" : "hover:border-black cursor-pointer"}  rounded-lg  transition-all duration-100`}>
             <span className="select-none">
                {size.title}
             </span>
          </li>
      )
   }

   if(product === null)  {
      return (
          <div></div>
      )
   }

   return (
       <div className="flex flex-col lg:flex-row justify-between lg:w-[90%] mx-auto  my-5">
            <div className="lg:flex block ">
                  <div className="hidden lg:flex ml-[6%] flex-col gap-4 w-[140px]">
                     {product?.images.map((image: string, index: number) => (
                         <Image src={image} key={image} priority={true}   width={140} height={140} alt="" className="object-cover cursor-pointer hover:shadow-xl hover:opacity-70  rounded-md" onMouseEnter={() => setSliderImage(index)}/>
                     ))}
                  </div>

               <div className="hidden lg:block w-full max-w-[720px] rounded-ld shrink">
                      <Image src={product?.images[0]} priority={true} width={720} height={720} alt="" className={`object-contain rounded-lg ${sliderImage === 0 ? "grid" : "hidden" }   grid-cols-productSizeSection aspect-[1/1]`}/>
                      <Image src={product?.images[1]} priority={true} width={720} height={720} alt="" className={`object-contain rounded-lg ${sliderImage === 1 ? "grid" : "hidden" }   grid-cols-productSizeSection aspect-[1/1]`}/>
                      <Image src={product?.images[2]} priority={true} width={720} height={720} alt="" className={`object-contain rounded-lg ${sliderImage === 2 ? "grid" : "hidden" }   grid-cols-productSizeSection aspect-[1/1]`}/>
                      <Image src={product?.images[3]} priority={true} width={720} height={720} alt="" className={`object-contain rounded-lg ${sliderImage === 3 ? "grid" : "hidden" }   grid-cols-productSizeSection aspect-[1/1]`}/>
               </div>

               <div className="block lg:hidden mx-3 mb-12 w-full shrink">
                  <Carousel
                      responsive={responsive}
                      swipeable={true}
                      draggable={true}
                      showDots={true}
                      partialVisbile={true}
                      ssr={true} // means to render carousel on server-side.
                      infinite={true}
                      keyBoardControl={true}
                      customTransition="all 2s"
                      transitionDuration={500}
                      containerClass="carousel-container"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      itemClass="carousel-item-padding-40-px">
                     {product.images.map((slide) => (
                         <Image src={slide} key={slide} width={720} height={720}  className="object-contain mx-auto select-none pointer-events-none pr-4 sm:pr-0" alt=""/>
                     ))}
                  </Carousel>
               </div>
            </div>

             <div className="mx-3 lg:mx-auto mt-5  lg:ml-auto lg:mt-0 min-w-[330px]  lg:grid lg:grid-cols-productSizeSection">
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
                   <ul className="grid grid-cols-3 gap-x-6 gap-y-2.5 mt-3 mb-6 w-full">
                      {/*@ts-ignore*/}
                      {product.sizes.map((size : {title: string, isAvailable: boolean}, index: number) => (
                          <SizeElement size={size} key={index} />
                      ))}
                   </ul>
                   <div className="flex flex-col gap-y-2 w-full">
                      <button onClick={() => buttonClick(ButtonAction.ADDTOBAG)} className="bg-black text-white rounded-full transition-all duration-200 py-[18px] hover:bg-gray-500">Add to Bag</button>
                      <button onClick={() => buttonClick(ButtonAction.ADDTOFAV)} className="border-2 border-gray-300 hover:border-black transition-all duration-100 rounded-full py-4">Add to Favorite</button>
                   </div>
                </div>
             </div>
       </div>
   );
};

export default Home;

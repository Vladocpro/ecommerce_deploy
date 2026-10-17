"use client"

import React, {useState} from 'react';
import Image from "next/image";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import PriceComponent from "../../PriceComponent";
import {useRouter} from "next/navigation";
import {Product} from "../../../types";
import useNotify from "../../useNotify";
import {CATEGORY_LABELS} from "../../../constants";


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

// Same `sizes` for the desktop image and the mobile carousel, so both resolve to the same file and it's fetched once
const MAIN_IMAGE_SIZES = "(min-width: 1280px) 581px, (min-width: 1024px) 482px, 100vw"

const sizeGuideUrl = (product: Product) : string => {
   switch (product.category) {
      case "Shoes":
         return `https://www.nike.com/gb/size-fit/${product.gender.toLowerCase()}s-footwear`
      case "TShirt":
         return `https://www.nike.com/gb/size-fit/${product.gender.toLowerCase()}s-tops-alpha`
      case "Trousers":
         return `https://www.nike.com/gb/size-fit/${product.gender.toLowerCase()}s-bottoms-alpha`
      case "Jacket":
         return `https://www.nike.com/gb/size-fit/${product.gender.toLowerCase()}s-tops-alpha`
      default:
         return "/"
   }
}

const ClientProduct =  ({product}: {product: Product }) => {
   const [sliderImage, setSliderImage] = useState<number>(0)
   const [sizes, setSizes] = useState<string[]>([]);
   const [pendingAction, setPendingAction] = useState<"cart" | "favorites" | null>(null)
   const notify = useNotify()
   const router = useRouter()

   const toggleSize = (title: string) => {
      setSizes((prev) => prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title])
   }

   const addToCart = async () => {
      if(pendingAction) return
      if(sizes.length === 0) {
         notify.error("Please select your size")
         return
      }
      setPendingAction("cart")
      try {
         const response = await axios.patch("/api/cart", {product: {id: product.id}, sizes})
         // Cleared only on success: after a failure the selection is kept so the user can retry
         setSizes([])
         notify.success(response.data?.message ?? "Added to Cart")
         router.refresh()
      } catch (error) {
         notify.requestError(error, "Couldn't add to cart, please try again")
      } finally {
         setPendingAction(null)
      }
   }

   const addToFavorites = async () => {
      if(pendingAction) return
      setPendingAction("favorites")
      try {
         const response = await axios.patch("/api/favorites", {id: product.id})
         notify.success(response.data?.message ?? "Added to Favorites")
         router.refresh()
      } catch (error) {
         notify.requestError(error, "Couldn't add to favorites, please try again")
      } finally {
         setPendingAction(null)
      }
   }


   return (
       <div className="flex flex-col lg:flex-row justify-center lg:gap-10 xl:gap-16 lg:w-[96%] xl:w-[92%] mx-auto  my-5">
          <div className="block lg:flex xl:min-w-[736px] gap-4">
             <div className="hidden lg:flex ml-auto flex-col gap-4 w-[140px]">
                {product.images.map((image, index) => (
                    <button type="button" key={image.publicId} aria-label={`Show image ${index + 1} of ${product.images.length}`} aria-pressed={sliderImage === index}
                            onMouseEnter={() => setSliderImage(index)} onFocus={() => setSliderImage(index)} onClick={() => setSliderImage(index)}>
                       <Image src={image.url} width={140} height={140} sizes="140px" alt="" className="object-cover cursor-pointer hover:shadow-xl hover:opacity-70 transition-all duration-200  rounded-md"/>
                    </button>
                ))}
             </div>

             <div className="hidden lg:block w-full lg:min-w-[482px] xl:max-w-[585px] rounded-ld shrink">
                {product.images.map((image, index) => (
                    <Image src={image.url} key={image.publicId} priority={index === 0} width={720} height={720} sizes={MAIN_IMAGE_SIZES} alt={product.title}
                           className={`object-contain rounded-lg  ${sliderImage === index ? "grid" : "hidden" }   grid-cols-productSizeSection xl:w-[581px] lg:w-[482px]`}/>
                ))}
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
                   {product.images.map((slide, index) => (
                       <Image src={slide.url} priority={index === 0} key={slide.publicId} width={630} height={650} sizes={MAIN_IMAGE_SIZES} className="object-contain mx-auto select-none pointer-events-none pr-4 sm:pr-0 lg:w-[110px] xl:w-[136px]" alt={product.title}/>
                   ))}
                </Carousel>
             </div>
          </div>

          <div className="mobile:mx-3 mx-auto lg:mx-0 mt-5 min-w-[305px] max-w-[400px] sm:max-w-[580px] md:max-w-[630px] lg:mt-0 lg:max-w-[350px] xl:max-w-[440px] w-full">
             <div className="flex flex-col w-full text-lg font-medium" >
                <h1 className="text-2xl">{product.title}</h1>
                <span className="text-gray-500 font-normal">{CATEGORY_LABELS[product.category]}</span>
                <span className="mt-2">
                   <PriceComponent product={product} showPercent={true}/>
                </span>
                <p className="font-normal mt-1 line-clamp-7 text-base">{product.description}</p>
             </div>
             <div className="text-lg font-semibold mt-4 ">
                <div className="flex justify-between">
                   <span id="select-size-label">Select Size</span>
                   <Link  href={sizeGuideUrl(product)} target="_blank" rel="noopener noreferrer" className="mr-1.5 text-gray-500 font-medium cursor-pointer">Size Guide</Link>
                </div>
                <div role="group" aria-labelledby="select-size-label" className="grid grid-cols-3 gap-y-3 gap-x-5  sm:gap-y-3.5 sm:gap-x-7 md:gap-y-3.5 md:gap-x-6 lg:gap-x-[14px] xl:gap-x-6 lg:gap-y-2 xl:gap-y-2.5 mt-3 mb-6 w-full">
                   {product.variants.map((variant) => (
                       <button type="button" key={variant.id}
                               disabled={variant.stock <= 0}
                               aria-pressed={sizes.includes(variant.size)}
                               onClick={() => toggleSize(variant.size)}
                               className={`flex items-center justify-center h-[38px] sm:h-[48px] md:h-[54px] lg:h-[42px] xl:h-[46px] border-2 ${sizes.includes(variant.size) ? "border-black" : " border-gray-300"}  ${variant.stock <= 0 ? " bg-gray-100 text-gray-300" : "hover:border-black cursor-pointer"}  rounded-lg  transition-all duration-100`}>
                          <span className="select-none text-sm sm:text-base">
                             {variant.size}
                          </span>
                       </button>
                   ))}
                </div>
                <div className="flex flex-col gap-y-2 w-full">
                   <button type="button" onClick={addToCart} disabled={pendingAction !== null} className="bg-black text-white rounded-full transition-all duration-200 hover:bg-gray-500 py-3.5 sm:py-[18px]  ">Add to Cart</button>
                   <button type="button" onClick={addToFavorites} disabled={pendingAction !== null} className="border-2 border-gray-300 hover:border-black transition-all duration-100 rounded-full py-3 sm:py-4 ">Add to Favorites</button>
                </div>
             </div>
          </div>
       </div>
   );
};

export default ClientProduct;

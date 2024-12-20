
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import PriceComponent from "../../components/PriceComponent";
import Loader from "../../components/Loader";
import {getSalesProducts} from "../../actions/getProducts";
import {Product} from "@prisma/client";


function getSeason() {
   const date = new Date();
   const month = date.getMonth();

   if (month < 2 || month > 10) {
      return 'Winter';
   } else if (month < 5) {
      return 'Spring';
   } else if (month < 8) {
      return 'Summer';
   } else {
      return 'Autumn';
   }
}

const Home = async () => {

  const products = await getSalesProducts()

   if(products === undefined) {
      return (
          <Loader/>
      )
   }


   return (
       <div className=" mt-3 ">
          <div className="flex flex-col bg-black text-white">
             <h1 className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 relative font-medium mt-5 mx-auto ">{getSeason()} Sale</h1>
             <div className={"relative bg-white w-fit mx-auto mb-3 sm:mb-5 before:content before:absolute before:h-6 before:w-5 before:bg-white before:right-[-10px] before:skew-x-[-30deg] before:content after:absolute after:h-6 after:w-5 after:bg-white after:left-[-10px] after:skew-x-[30deg]"}>
                <span className="text-sm sm:text-base text-black font-bold px-3  sm:mx-auto  text-justify w-full sm:w-2/3 mb-8 ">Up to 15% off</span>
             </div>
             <span className="text-sm sm:text-base px-3  sm:mx-auto  text-justify w-full sm:w-2/3 mb-7 text-white">Visit our outlet stores from your couch and discover the best discounts and offers from a big selection of reduced NIKE items. Take advantage of our great trainers sales prices and add to your sneakers collection for less. Find great deals on the articles you love browsing our sportswear sales collection. It does not matter if you are a running addict, a sneakerhead or a committed yogi, thanks to our discount deals you will be able to get the best in running trainers sales, trainers markdowns and reduced training articles without breaking the bank. Order now and save with our latest NIKE articles on sale.</span>
          </div>

          <div className="Container">
             {products && (
                 <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-y-6 gap-5 text-black mb-10">
                    {products?.map((product: Product) => (
                        <div key={product.id} className="">
                           <Link href={`/store/product/${product.id}`} className="w-full ">
                              <Image
                                  className="w-full  object-cover pointer-events-none select-none"
                                  // fill
                                  priority={true}
                                  height={620}
                                  width={600}
                                  // @ts-ignore
                                  src={product.images[0]}
                                  alt="Image"
                              />
                              <div className="flex flex-col text-lg font-medium cursor-pointer" >
                                 <span>{product.title}</span>
                                 <span className="text-gray-500 font-normal leading-4">{product.category}</span>
                                 <span className="mt-2">
                                   {/* @ts-ignore */}
                                 <PriceComponent product={product} showPercent={true} mobileHidePercent={true} />
                                 </span>
                              </div>
                           </Link>
                        </div>

                    ))}
                 </div>
             )}
          </div>

       </div>
   );
};

export default Home;

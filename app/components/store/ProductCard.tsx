import React from 'react';
import Image from "next/image";
import Link from "next/link";
import PriceComponent from "../PriceComponent";
import {Product} from "../../types";
import {CATEGORY_LABELS} from "../../constants";

interface ProductCardProps {
   product: Product,
   // Only the first row of a grid is above the fold: preloading every image delays the ones that matter
   priority?: boolean
}

// Grid of 2 columns, 3 from `lg` (the store also has a 200px sidebar there)
const GRID_IMAGE_SIZES = "(min-width: 1024px) 30vw, 48vw"

const ProductCard = ({product, priority = false}: ProductCardProps) => {
   return (
       <div>
          <Link  href={`/store/product/${product.slug}`} className="w-full ">
             {product.images[0] && (
                 <Image
                     className="w-full  object-cover pointer-events-none select-none"
                     priority={priority}
                     height={620}
                     width={600}
                     sizes={GRID_IMAGE_SIZES}
                     src={product.images[0].url}
                     alt={product.title}
                 />
             )}
             <div className="flex flex-col text-lg font-medium cursor-pointer" >
                <span>{product.title}</span>
                <span className="text-gray-500 font-normal leading-4">{CATEGORY_LABELS[product.category]}</span>
                <span className="mt-2">
                   <PriceComponent product={product} showPercent={true} mobileHidePercent={true} />
                </span>
             </div>
          </Link>
       </div>
   );
};

export default ProductCard;

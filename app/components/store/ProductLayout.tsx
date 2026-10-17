import React, {FC} from 'react';
import Link from "next/link";
import {Product} from "../../types";
import ProductCard from "./ProductCard";
import EmptyState, {emptyStateButtonStyles} from "../EmptyState";

interface ProductLayoutProps {
   products: Product[]
}

// Number of cards in the first row on desktop
const ABOVE_THE_FOLD = 3

const ProductLayout: FC<ProductLayoutProps> = ({products}) => {

   if(products.length === 0) {
      return  (
          <EmptyState title="Couldn't find the product!" className="h-[50vh] sm:h-[70vh]">
             <Link href="/store" className={emptyStateButtonStyles}>Reset Filters</Link>
          </EmptyState>
      )
   }

   return (
       <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-y-6 gap-5 text-black mb-10">
          {products.map((product : Product, index: number) => (
              <ProductCard key={product.id} product={product} priority={index < ABOVE_THE_FOLD}/>
          ))}
       </div>
   );
};

export default ProductLayout;

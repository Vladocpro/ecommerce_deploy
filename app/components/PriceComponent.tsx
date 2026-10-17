import React from "react";
import {Product} from "../types";
import {formatPrice} from "../../lib/money";

interface PriceComponentProps {
   // Amounts are in pence; finalPrice already has the discount applied
   product: Pick<Product, "price" | "discountPercent" | "finalPrice">,
   showPercent: boolean,
   mobileHidePercent?: boolean,
   // Shows the price of this many items (cart lines)
   quantity?: number,
}

const PriceComponent = ({product, showPercent, mobileHidePercent = false, quantity = 1} : PriceComponentProps) : React.JSX.Element => {

   if(product.discountPercent > 0) {
      return  (
          <span className="flex">
              <span>{formatPrice(product.finalPrice * quantity)}</span>
              <span className="ml-2.5 font-normal text-gray-400 decoration-2 decoration-gray-400 line-through">
                 <span className="sr-only">Original price </span>{formatPrice(product.price * quantity)}
              </span>
              <span className={`ml-2.5 ${mobileHidePercent ? "mobile:hidden" : ""} ${!showPercent ? "hidden" : ""} font-semibold text-white rounded-[4px] bg-black px-2.5`}>{product.discountPercent}% off</span>
          </span>
      )
   }

   return (
       <span>{formatPrice(product.finalPrice * quantity)}</span>
   )

}
export default PriceComponent;

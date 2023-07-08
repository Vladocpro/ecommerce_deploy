import React from "react";
import {Product} from "../types";

const PriceComponent = ({product, showPercent, mobileHidePercent = false} : { product: Product , showPercent: boolean, mobileHidePercent?: boolean }) : JSX.Element => {


   if(product.sale > 0) {
      const calculatedPrice = (product.price - ((product.price * product.sale) / 100 )).toFixed(2)
      // let styles = ""
      // if(showPercent) {
      //    styles = ""
      //    if(mobileHidePercent) {
      //       "mobile:hidden"
      //    }
      // } else  {
      //    styles = "hidden"
      // }
      return  (
          <span className="flex">
              <span>£{product.quantity !== undefined ? (Number(calculatedPrice) * product.quantity).toFixed(2) : calculatedPrice}</span>
              <span className="ml-2.5 font-normal text-gray-400 decoration-2 decoration-gray-400 line-through">£{product.quantity !== undefined ? (product.price * product.quantity).toFixed(2) :product.price}</span>
              <span className={`ml-2.5 ${mobileHidePercent && "mobile:hidden"} ${!showPercent && "hidden"} font-medium text-green-500`}>{product.sale}% off</span>
          </span>
      )
   }

   return (
       <span>£{product.quantity !== undefined ? (product.price * product.quantity).toFixed(2) :product.price}</span>
   )

}
export default PriceComponent;

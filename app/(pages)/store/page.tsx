import React from 'react';
import { getProducts } from "../../actions/getProducts";
import DropDownOptions from "../../components/dropdown/DropDownOptions";
import ProductLayout from "../../components/store/ProductLayout";
import Filters from "../../components/store/Filters";
import FiltersPopup from "../../components/modals/filtersPopup/FiltersPopup";

const Store = async () => {

   const products = await getProducts()

   return (
       <>
       <div className="flex flex-col w-[94%]  mx-auto">
          <Filters/>
          <div className="flex">
             <aside className="hidden lg:block ml-1 w-[250px]  pb-2">
                <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[190px] font-medium" svgBox="right-12" title="On Sale"  category="sale"     options={["Sale"]} />
                <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[190px] font-medium" svgBox="right-12" title="Price"    category="price"    options={["Under £50", "£50 - £100","£100 - £200"]} />
                <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[190px] font-medium" svgBox="right-12" title="Category" category="category" options={["Shoes","Trousers","T-Shirt","Jacket"]} />
                <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[190px] font-medium" svgBox="right-12" title="Gender"   category="gender"   options={["Men","Women"]} />
                <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[190px] font-medium" svgBox="right-12" title="Sizes"    category="sizes"    options={["XS","S","M","L","XL","2XL","3XL","UK 5.5","UK 6","UK 6.5","UK 7","UK 7.5","UK 8","UK 8.5","UK 9","UK 9.5","UK 10","UK 10.5","UK 11","UK 11.5","UK 12","UK 12.5"]} />
             </aside>
             <div>
                 {/*@ts-ignore*/}
                <ProductLayout products={products} />
             </div>
          </div>
       </div>

       <FiltersPopup/>
   </>
   );
};

export default Store;

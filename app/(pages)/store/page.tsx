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
          <div className="flex gap-6 xl:gap-10">
                <aside className="hidden lg:inline-block ml-1 min-w-[200px] w-[200px] pb-2">
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="On Sale" category="sale"  showUnderline={true}
                                    options={["Sale"]}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Price" category="price"  showUnderline={true}
                                    options={["Under £50", "£50 - £100", "£100 - £200"]}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Category" category="category"  showUnderline={true}
                                    options={["Shoes", "Trousers", "T-Shirt", "Jacket"]}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Gender" category="gender"  showUnderline={true}
                                    options={["Men", "Women"]}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Sizes" category="sizes" showUnderline={false}
                                    options={["XS", "S", "M", "L", "XL", "2XL", "3XL", "UK 5.5", "UK 6", "UK 6.5", "UK 7", "UK 7.5", "UK 8", "UK 8.5", "UK 9", "UK 9.5", "UK 10", "UK 10.5", "UK 11", "UK 11.5", "UK 12", "UK 12.5"]}/>
                </aside>
             <div className={'w-full'}>
                {/*@ts-ignore*/}
                <ProductLayout products={products}/>
             </div>
          </div>
       </div>

          <FiltersPopup/>
       </>
   );
};

export default Store;

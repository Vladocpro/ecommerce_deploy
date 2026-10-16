import React from 'react';
import type { Metadata } from "next";
import { getProducts } from "../../actions/getProducts";
import DropDownOptions from "../../components/dropdown/DropDownOptions";
import ProductLayout from "../../components/store/ProductLayout";
import Pagination from "../../components/store/Pagination";
import Filters from "../../components/store/Filters";
import FiltersPopup from "../../components/modals/filtersPopup/FiltersPopup";
import {CATEGORY_OPTIONS, fillFilterObject, GENDER_OPTIONS, PRICE_RANGES, SALE_OPTIONS, SIZE_OPTIONS} from "../../constants";

export const metadata: Metadata = {
   title: "Store",
   description: "Shop Nike shoes, T-shirts, trousers and jackets for men and women. Filter by size, price and category.",
}

type Props = {
   searchParams: Promise<Record<string, string | string[] | undefined>>
}

const Store = async ({searchParams}: Props) => {

   const query = await searchParams
   const {products, page, pageCount} = await getProducts(fillFilterObject(query))

   return (
       <>
       <div className="flex flex-col w-[94%]  mx-auto">
          <Filters/>
          <div className="flex gap-6 xl:gap-10">
                <aside className="hidden lg:inline-block ml-1 min-w-[200px] w-[200px] pb-2">
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="On Sale" category="sale"  showUnderline={true}
                                    options={SALE_OPTIONS}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Price" category="price"  showUnderline={true}
                                    options={PRICE_RANGES}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Category" category="category"  showUnderline={true}
                                    options={CATEGORY_OPTIONS}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Gender" category="gender"  showUnderline={true}
                                    options={GENDER_OPTIONS}/>
                   <DropDownOptions isExpanded={true} titleStyles="relative text-lg w-[200px] font-medium"
                                    title="Sizes" category="sizes" showUnderline={false}
                                    options={SIZE_OPTIONS}/>
                </aside>
             <div className={'w-full'}>
                <ProductLayout products={products}/>
                <Pagination page={page} pageCount={pageCount} searchParams={query}/>
             </div>
          </div>
       </div>

          <FiltersPopup/>
       </>
   );
};

export default Store;

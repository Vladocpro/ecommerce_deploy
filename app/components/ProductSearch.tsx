"use client"

import React, {useEffect, useMemo, useRef, useState} from "react";
import debounce from "lodash.debounce";
import useClickOutside from "../components/useClickOutside";
import {Product} from "../types";
import Image from "next/image";
import {getFetch} from "../../lib/fetcher";

interface ProductSearchProps {
   selectedProduct: Product | null;
   setSelectedProduct: (product: Product | null) => void;
}

const MAX_RESULTS = 5

const ProductSearch = ({selectedProduct, setSelectedProduct} :ProductSearchProps) => {
   const [searchValue, setSearchValue] = useState<string>("");
   const [products, setProducts] = useState<Product[]>([])
   const [isOpen, setIsOpen] = useState(false)
   const selectedImage = selectedProduct?.images[0]?.url

   const dropdownRef = useRef<HTMLDivElement | null>(null);
   const inputRef = useRef<HTMLInputElement | null>(null);


   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });

   // Created once: a new debounced function per render would fire one request per keystroke
   const debouncedSearch = useMemo(() => debounce((text: string) => {
      setSearchValue(text.trim());
   }, 500), []);

   useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      debouncedSearch(e.target.value);
   }

   const handleSelectProduct = (product : Product) => {
      if (inputRef.current) {
         inputRef.current.value = '';
      }
      setSelectedProduct(product)
   };


   useEffect(() => {
      // An empty search shows no results without a request (see `visibleProducts`)
      if(searchValue === "") return
      // Ignore responses that arrive after a newer search started
      let ignore = false
      getFetch(`/api/product/${encodeURIComponent(searchValue)}`)
          .then((response: Product[]) => {
             if (!ignore) setProducts(response)
          })
          .catch(() => {
             if (!ignore) setProducts([])
          })
      return () => {
         ignore = true
      }
   }, [searchValue]);

   const visibleProducts = searchValue === "" ? [] : products.slice(0, MAX_RESULTS)

   return (
       <div className={'relative w-full'} ref={dropdownRef}>
          <div
              className={`flex gap-3 items-center  cursor-pointer select-none justify-between h-12 ${searchValue.length > 0 ? 'rounded-t-lg ' : 'rounded-lg'}`}>

             <div className=" relative w-full">

                {
                   selectedProduct === null || selectedImage === undefined ?
                       (
                       <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-1.5 top-2 fill-white h-9 w-9 stroke-black" viewBox="0 0 24 24"
                            strokeWidth="1"  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
                       </svg>
                       ) : (
                           <Image src={selectedImage} width={150} height={150} sizes="35px" className="w-[35px] h-[42px] absolute top-1 left-2 rounded-md" alt={selectedProduct.title}/>
                       )
                }

                <input
                    type="text"
                    ref={inputRef}
                    aria-label="Search product title"
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                       setIsOpen(false)
                       if (inputRef.current && selectedProduct !== null) {
                          inputRef.current.value = ''; // Clear the input value
                       }
                    }}
                    placeholder={selectedProduct !== null ? selectedProduct.title : 'Search Product Title'}
                    className={`w-full outline-none text-black  pl-12 pr-5  rounded-lg mr-10 border-[1.75px] border-gray-300 py-3  ${selectedProduct !== null ? 'placeholder-black' : 'placeholder-gray-400'}`}/>
                <button type="button" aria-label="Clear selected product" onClick={() => setSelectedProduct(null)}
                        className={`absolute right-2 top-[9px] ${selectedProduct === null ? 'hidden' : 'block'}`}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} aria-hidden="true"
                        className="fill-white h-8 w-8 stroke-black">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                   </svg>
                </button>

             </div>
             {/*Dropdown Options*/}
             <div
                 className={`absolute z-10 right-0 top-6  ${isOpen ? "  opacity-100 visible" : " opacity-0 invisible "} ${visibleProducts.length > 0 ? 'mt-7 py-1' : ''}  transition-all duration-300  rounded-lg select-none w-full space-y-1 bg-gray-200`}>
                {visibleProducts.map((product, index) => (
                    <button type="button" key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className={`flex w-full text-left items-center gap-2 hover:bg-secondaryGreen text-black cursor-pointer h-[56px] px-2 rounded-sm ${index < visibleProducts.length - 1 ? "border-b border-b-gray-400" : ""}`}>
                        {product.images[0]?.url && <Image src={product.images[0].url} width={150} height={150} sizes="40px" className="w-[40px]" alt=""/>}

                       <span className={'ml-1'}>{product.title}</span>
                       {product.archived && (
                           <span className="ml-auto shrink-0 text-xs font-semibold uppercase rounded-[4px] bg-gray-500 text-white px-2 py-0.5">Archived</span>
                       )}
                    </button>
                ))}

             </div>
          </div>
       </div>

   );
};

export default ProductSearch;

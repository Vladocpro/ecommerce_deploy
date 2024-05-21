"use client"

import React, {FC, useEffect, useRef, useState} from "react";
import debounce from "lodash.debounce";
import useClickOutside from "../components/useClickOutside";
import {Product} from "@prisma/client";
import Image from "next/image";
import {getFetch} from "../../lib/fetcher";

interface ProductSearchProps {
   selectedProduct: Product | null;
   setSelectedProduct: (product: Product | null) => void;
}

const ProductSearch = ({selectedProduct, setSelectedProduct} :ProductSearchProps) => {
   const [searchValue, setSearchValue] = useState<string>("");
   const [products, setProducts] = useState<Product[]>([])
   const [isOpen, setIsOpen] = useState(false)

   const dropdownRef = useRef<HTMLDivElement | null>(null);
   const inputRef = useRef<HTMLInputElement | null>(null);


   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });

   const debouncedSearch = debounce((text) => {
      setSearchValue(text);
   }, 500);

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
      if(searchValue === "") return
         getFetch(`/api/product/${searchValue}`)
             .then((response) => {
                setProducts(response)
             })
             .catch((error) => {
                console.log(error)
             })
   }, [searchValue]);

   return (
       <div className={'relative w-full'} ref={dropdownRef}>
          <div
              className={`flex gap-3 items-center  cursor-pointer select-none justify-between h-12 ${searchValue.length > 0 ? 'rounded-t-lg ' : 'rounded-lg'}`}>

             <div className=" relative w-full">

                {
                   selectedProduct === null ?
                       (
                       <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-1.5 top-2 fill-white h-9 w-9 stroke-black" viewBox="0 0 24 24"
                            strokeWidth="1"  strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
                       </svg>
                       ) : (
                           <Image src={selectedProduct?.images[0]} width={150} height={150} className="w-[35px] h-[42px] absolute top-1 left-2 rounded-md" alt="Image"/>
                       )
                }

                <input
                    type="text"
                    ref={inputRef}
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25}
                     onClick={() => setSelectedProduct(null)}
                     className={`absolute right-2 top-[9px] fill-white h-8 w-8 stroke-black ${selectedProduct === null ? 'hidden' : 'block'}`}>
                   <path strokeLinecap="round" strokeLinejoin="round"
                         d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>

             </div>
             {/*Dropdown Options*/}
             <div
                 className={`absolute z-10 right-0 top-6  ${isOpen ? "  opacity-100 visible" : " opacity-0 invisible "} ${products?.length > 0 ? 'mt-7 py-1' : ''}  transition-all duration-300  rounded-lg select-none w-full space-y-1 bg-gray-200`}>
                {products.slice(0, 5).map((product, index) => (
                    <div key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className={`flex  items-center gap-2 hover:bg-secondaryGreen text-black cursor-pointer h-[56px] px-2 rounded-sm ${(products.length > 4 && index === 4 ) || products.length !== index + 1 && "border-b border-b-gray-400"}`}>
                        <Image src={product?.images[0]} width={150} height={150} className="w-[40px]" alt="Image"/>

                       <span className={'ml-1'}>{product.title}</span>
                    </div>
                ))}

             </div>
          </div>
       </div>

   );
};

export default ProductSearch;

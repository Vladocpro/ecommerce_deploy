"use client"

import React, {FC, useEffect, useRef, useState} from "react";
import debounce from "lodash.debounce";
import useClickOutside from "../components/useClickOutside";
import {Product} from "@prisma/client";
import Image from "next/image";
import {getFetch} from "../../lib/fetcher";

interface ProductSearchProps {
   chosenProduct: Product | null;
   setChosenProduct: (product: Product | null) => void;
}

const ProductSearch = ({chosenProduct, setChosenProduct} :ProductSearchProps) => {
   const [searchValue, setSearchValue] = useState<string>('');
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

   const handleChooseOpponent = (product : Product) => {
      if (inputRef.current) {
         inputRef.current.value = '';
      }
      setChosenProduct(product)
   };


   useEffect(() => {
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
              className={`flex gap-3 items-center  cursor-pointer select-none justify-between h-12 ${searchValue.length > 0 ? 'rounded-t-lg ' : 'rounded-lg'} bg-gray-500`}>

             <div className=" relative w-full">

                {
                   chosenProduct === null ?
                       (
                           <svg className="absolute left-2 top-2 fill-white h-8 w-8" viewBox="0 0 24 24" role="img">
                              <path fillRule="evenodd"
                                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                    clipRule="evenodd"/>
                           </svg>
                       ) : (
                           <Image src={chosenProduct?.images[0]} width={150} height={150} className="w-[33px] h-[40px] relative top-5 left-2 rounded-md" alt="Image"/>
                       )
                }

                <input
                    type="text"
                    ref={inputRef}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                       setIsOpen(false)
                       if (inputRef.current && chosenProduct !== null) {
                          inputRef.current.value = ''; // Clear the input value
                       }
                    }}
                    placeholder={chosenProduct !== null ? chosenProduct.title : 'Search product title'}
                    className={`bg-gray-500 w-full outline-none text-[#ffffffd9] ${chosenProduct !== null ? 'placeholder-white' : 'placeholder-[#ffffff80]'}   pl-12 pr-5  rounded-lg mr-10 `}/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     onClick={() => setChosenProduct(null)}
                     className={`absolute right-2 top-4 fill-white h-8 w-8 stroke-black ${chosenProduct === null ? 'hidden' : 'block'}`}>
                   <path strokeLinecap="round" strokeLinejoin="round"
                         d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>

             </div>
             {/*Dropdown Options*/}
             <div
                 className={`absolute z-10 right-0 top-10  ${isOpen ? "  opacity-100 visible" : " opacity-0 invisible "} ${products?.length > 0 ? 'pt-7' : ''}  transition-all duration-300  rounded-b-lg select-none w-full bg-primaryLight  space-y-1`}>
                {products.slice(0, 5).map((product, index) => (
                    <div key={product.id}
                        onClick={() => handleChooseOpponent(product)}
                        className={'flex bg-gray-300 items-center gap-2 hover:bg-secondaryGreen text-black cursor-pointer h-12 px-2 rounded-sm'}>
                        <Image src={product?.images[0]} width={150} height={150} className="w-[36px]" alt="Image"/>

                       <span className={'ml-2'}>{product.title}</span>
                    </div>
                ))}

             </div>
          </div>
       </div>

   );
};

export default ProductSearch;

"use client"

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {setFiltersPopup} from "../../../redux/slices/modals";
import debounce from "lodash.debounce";
import FilterSectionContainer from "./FilterSectionContainer";
import SectionOptions from "./SectionOptions";
import { useRouter, useSearchParams } from 'next/navigation';
import qs from "query-string";
import {IFiltersState} from "../../../types";
import {fillFilterObject} from "../../../constants";

const defaultFilterState = {
   sortBy: null,
   search: null,
   sale: false,
   price: [],
   category: [],
   gender: [],
   sizes: [],
}
const sizes= ["XS","S","M","L","XL","2XL","3XL","UK 5.5","UK 6","UK 6.5","UK 7","UK 7.5","UK 8","UK 8.5","UK 9","UK 9.5","UK 10","UK 10.5","UK 11","UK 11.5","UK 12","UK 12.5"]

const FiltersPopup = () => {

   const isOpen: boolean = useSelector((state: RootState) => state.modals.filtersPopup)
   const inputRef = useRef<HTMLInputElement | null>(null);
   const [tempFilters, setTempFilters] = useState<IFiltersState>(defaultFilterState)
   const dispatch = useDispatch()
   const router = useRouter()
   const params = useSearchParams()

   const filtersCount : number = useMemo(() => {
      let counter = 0;
      if(tempFilters.sortBy !== null)
         counter++;
      if(tempFilters.search !== null && tempFilters.search !== "")
         counter++;
      if(tempFilters.sale)
         counter++;
      if(tempFilters.price.length !== 0)
         counter++;
      if(tempFilters.category.length !== 0)
         counter++;
      if(tempFilters.gender.length !== 0)
         counter++;
      if(tempFilters.sizes.length !== 0)
         counter++;
      return counter

   }, [tempFilters]);

   const debouncedSearch = debounce((text) => {
      setTempFilters({...tempFilters, search: text})
   }, 500);

   function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
      debouncedSearch(e.target.value);
   }

   const applyFilters = () => {
      let requestFilters = Object.assign({}, tempFilters)
      if(tempFilters.search?.trim() === "") {
         requestFilters.search = null
      }

      const url = qs.stringifyUrl({
         url: "/store",
         // @ts-ignore
         query: requestFilters
      }, {skipNull: true})

      router.push(url)
      dispatch(setFiltersPopup(false))
   }
   const clearFilters= () => {
      if (inputRef && inputRef.current) {
         inputRef.current.value = "";
      }
      setTempFilters(defaultFilterState)
      router.push("/store")
   }
   const handleChange = (event: any, category: string, title: string) => {
      switch (category) {
         case "sale": {
            setTempFilters({...tempFilters, sale: event.target.checked})
            break;
         }
         case "price": {
            if (title === "Under £50") {
               if (event.target.checked)
                  setTempFilters({...tempFilters, price: [...tempFilters.price, "£0 - £50"]})
               else
                  setTempFilters({...tempFilters, price: tempFilters.price.filter((price) => price !== "£0 - £50")})
            }
            else {
               if(event.target.checked)
                  setTempFilters({...tempFilters, price: [...tempFilters.price, title]})
               else
                  setTempFilters({...tempFilters, price: tempFilters.price.filter((price) => price !== title)})
            }
            break;
         }
         case "category": {
            if(event.target.checked)
               setTempFilters({...tempFilters, category: [...tempFilters.category, title]})
            else
               setTempFilters({...tempFilters, category: tempFilters.category.filter((category) => category !== title)})
            break;
         }
         case "gender": {
            if(event.target.checked)
               setTempFilters({...tempFilters, gender: [...tempFilters.gender, title]})
            else
               setTempFilters({...tempFilters, gender: tempFilters.gender.filter((gender) => gender !== title)})
            break;
         }
         case "sizes": {
            if(!tempFilters.sizes.includes(title))
               setTempFilters({...tempFilters, sizes: [...tempFilters.sizes, title]})
            else
               setTempFilters({...tempFilters, sizes: tempFilters.sizes.filter((size) => size !== title)})
            break;
         }
         default:
            break;
      }
   }

   useEffect(() => {
      if(inputRef.current === null) return;
      const parsedParams  = qs.parse(params?.toString() as string);
      if(params?.toString() === "") {
         clearFilters()
         return
      }
      const filters: IFiltersState = fillFilterObject(parsedParams)
      if(parsedParams.search  === undefined || parsedParams.search  === null || parsedParams.search === "") {
         filters.search = ""
         inputRef.current.value = ""
      } else {
         // @ts-ignore
         filters.search = parsedParams.search;
         // @ts-ignore
         inputRef.current.value = parsedParams.search
      }

      if(parsedParams.sortBy  === undefined || parsedParams.sortBy  === null || parsedParams.sortBy === "") {
          filters.sortBy = null
      } else {
         // @ts-ignore
         filters.sortBy = parsedParams.sortBy
      }
      filters.sale = parsedParams.sale === "true";
      setTempFilters(filters)
   }, [params]);

   useEffect(() => {
      if(isOpen)
         window.scrollTo(0, 0)
   }, [isOpen]);

   return (
          <div className={`bg-white overflow-x-hidden overflow-y-scroll text-black fixed flex flex-col gap-5 z-20 inset-0 transition-all duration-[400ms] ${isOpen ? "translate-y-0 visible" : "translate-y-[100%] invisible"}`}>

             <div className="sticky w-full z-30  top-6 pr-5 h-full cursor-pointer flex justify-end">
                <svg fill="#111" height={32} width={32} viewBox="0 0 24 24" className="absolute"  onClick={() => dispatch(setFiltersPopup(false))}>
                   <path d="M12 0C9.813 0 7.8.533 5.96 1.6A11.793 11.793 0 0 0 1.6 5.96C.533 7.8 0 9.813 0 12s.533 4.2 1.6 6.04a11.793 11.793 0 0 0 4.36 4.36C7.8 23.467 9.813 24 12 24s4.2-.533 6.04-1.6a11.793 11.793 0 0 0 4.36-4.36C23.467 16.2 24 14.187 24 12s-.533-4.2-1.6-6.04a11.793 11.793 0 0 0-4.36-4.36C16.2.533 14.187 0 12 0zm5.2 15.28l-1.92 1.92L12 13.84 8.72 17.2 6.8 15.28 10.16 12 6.8 8.72 8.72 6.8 12 10.08l3.28-3.28 1.92 1.92L13.92 12l3.28 3.28z"/>
                </svg>
             </div>

             <span className=" ml-5 mr-3  text-lg">Filters</span>

             <FilterSectionContainer title="Search">
                <div className="relative mt-4">
                   <svg aria-hidden="true" className="absolute left-2 top-2"  viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                      <path stroke="currentColor" strokeWidth="1.5"
                            d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
                   </svg>
                   <input  type="text" onChange={(e) => handleSearchChange(e)} ref={inputRef} className="bg-gray-100  pl-9 pr-5 w-full outline-black text-base focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 py-2 rounded-full" placeholder="Search"/>
                </div>
             </FilterSectionContainer>

             <FilterSectionContainer title="Sort By">
                <form className="flex flex-col gap-3 mt-4">
                   <div className="flex items-center cursor-pointer" onClick={() => setTempFilters({...tempFilters, sortBy: "Featured"})}>
                      <input type="radio" readOnly id="featuredInput"  className="h-5 w-5" name="fav_language" value="Featured" checked={tempFilters.sortBy === "Featured"}/>
                      <label htmlFor="featuredInput" className="ml-3">Featured</label>
                   </div>
                   <div className="flex items-center cursor-pointer" onClick={() => setTempFilters({...tempFilters, sortBy: "Price: High-Low"})}>
                      <input type="radio" readOnly id="highLowInput" className="h-5 w-5" name="fav_language" value="Price: High-Low" checked={tempFilters.sortBy === "Price: High-Low"}/>
                      <label htmlFor="highLowInput" className="ml-3">Price: High-Low</label>
                   </div>
                   <div className="flex items-center cursor-pointer" onClick={() => setTempFilters({...tempFilters, sortBy: "Price: Low-High"})}>
                      <input type="radio" readOnly id="lowHighInput" className="h-5 w-5" name="fav_language" value="Price: Low-High" checked={tempFilters.sortBy === "Price: Low-High"}/>
                      <label htmlFor="lowHighInput" className="ml-3">Price: Low-High</label>
                   </div>
                </form>
             </FilterSectionContainer>

             <FilterSectionContainer title="Sale">
                <SectionOptions options={["Sale"]} category="sale" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Price">
                <SectionOptions options={["Under £50", "£50 - £100","£100 - £200"]} category="price" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Category">
                <SectionOptions options={["Shoes","Trousers","T-Shirt","Jacket"]} category="category" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Gender">
                <SectionOptions options={["Men","Women"]} category="gender" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Sizes">
                <ul className="flex flex-wrap gap-2 mt-4">
                   {sizes.map((size, index) =>  (
                       <li key={index} onClick={() => {handleChange(event,"sizes", size)}} className={`flex items-center justify-center h-[46px] w-[75px] cursor-pointer border-2 ${tempFilters.sizes.includes(size) ? "border-black" : " border-gray-300"}   rounded-lg  transition-all duration-100`}>
                         <span className="select-none ">
                            {size}
                         </span>
                       </li>
                   ))}
                </ul>

             </FilterSectionContainer>


             <div className="sticky h-16 overflow-y-hidden bottom-0 px-2 w-full bg-gray-100  flex gap-4 pt-2 pb-[52px] justify-between">
                <button className="h-[39px]  bg-white w-full rounded-2xl  border-[1.5px] border-gray-300" onClick={() => {
                   clearFilters();
                }}>
                   Clear ({filtersCount})
                </button>
                <button className="h-[39px] w-full rounded-2xl bg-black text-white " onClick={applyFilters}>
                   Apply
                </button>
             </div>

          </div>

   );
};

export default FiltersPopup;

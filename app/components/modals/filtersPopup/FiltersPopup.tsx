"use client"

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {setFiltersPopup} from "../../../redux/slices/modals";
import FilterSectionContainer from "./FilterSectionContainer";
import SectionOptions, {CheckboxCategory} from "./SectionOptions";
import { useRouter, useSearchParams } from 'next/navigation';
import qs from "query-string";
import {Category, Gender, IFiltersState} from "../../../types";
import {ALL_SIZES, CATEGORY_LABELS, CATEGORY_OPTIONS, fillFilterObject, GENDER_OPTIONS, GENDERS, PRICE_RANGES, SALE_OPTIONS, SORT_OPTIONS} from "../../../constants";
import useDialog from "../useDialog";

const defaultFilterState: IFiltersState = {
   sortBy: null,
   search: null,
   sale: false,
   price: [],
   category: [],
   gender: [],
   sizes: [],
   page: 1,
}

const toggle = <T extends string>(list: T[], value: T, on: boolean): T[] => {
   if (on) return list.includes(value) ? list : [...list, value]
   return list.filter((item) => item !== value)
}

const isCategory = (value: string): value is Category => value in CATEGORY_LABELS
const isGender = (value: string): value is Gender => (GENDERS as string[]).includes(value)

const FiltersPopup = () => {

   const isOpen: boolean = useSelector((state: RootState) => state.modals.filtersPopup)
   const dialogRef = useRef<HTMLDivElement | null>(null);
   // A draft of the filters: only written to the URL when the user presses Apply
   const dispatch = useDispatch()
   const router = useRouter()
   const params = useSearchParams()
   const [tempFilters, setTempFilters] = useState<IFiltersState>(() => fillFilterObject(qs.parse(params?.toString() ?? "")))

   const closePopup = useCallback(() => {
      dispatch(setFiltersPopup(false))
   }, [dispatch])
   useDialog(isOpen, closePopup, dialogRef)

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

   // Whenever the URL changes (applied here, from the desktop filters or a reset) the draft starts from it again
   const query = params?.toString() ?? ""
   const [syncedQuery, setSyncedQuery] = useState<string>(query)
   if (query !== syncedQuery) {
      setSyncedQuery(query)
      setTempFilters(fillFilterObject(qs.parse(query)))
   }

   useEffect(() => {
      if(isOpen)
         window.scrollTo(0, 0)
   }, [isOpen]);

   const applyFilters = () => {
      const search = tempFilters.search?.trim()
      const url = qs.stringifyUrl({
         url: "/store",
         // page is dropped: new filters start from the first page of results
         query: {...tempFilters, search: search ? search : null, sale: tempFilters.sale ? true : null, page: null}
      }, {skipNull: true})

      router.push(url)
      closePopup()
   }

   const clearFilters = () => {
      setTempFilters(defaultFilterState)
      router.push("/store")
   }

   // Functional updates: several changes can be queued before a re-render, none of them may be lost
   const handleChange = (category: CheckboxCategory, value: string, checked: boolean) => {
      setTempFilters((prev) => {
         switch (category) {
            case "sale":
               return {...prev, sale: checked}
            case "price":
               return {...prev, price: toggle(prev.price, value, checked)}
            case "category":
               return isCategory(value) ? {...prev, category: toggle(prev.category, value, checked)} : prev
            case "gender":
               return isGender(value) ? {...prev, gender: toggle(prev.gender, value, checked)} : prev
         }
      })
   }

   const toggleSize = (size: string) => {
      setTempFilters((prev) => ({...prev, sizes: toggle(prev.sizes, size, !prev.sizes.includes(size))}))
   }

   return (
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="filters-popup-title"
               className={`bg-white overflow-x-hidden overflow-y-scroll text-black fixed flex flex-col gap-5 z-20 inset-0 transition-all duration-[400ms] ${isOpen ? "translate-y-0 visible" : "translate-y-[100%] invisible"}`}>

             <div className="sticky w-full z-30  top-6 pr-5 h-full cursor-pointer flex justify-end">
                <button type="button" aria-label="Close filters" className="absolute" onClick={closePopup}>
                   <svg fill="#111" height={32} width={32} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C9.813 0 7.8.533 5.96 1.6A11.793 11.793 0 0 0 1.6 5.96C.533 7.8 0 9.813 0 12s.533 4.2 1.6 6.04a11.793 11.793 0 0 0 4.36 4.36C7.8 23.467 9.813 24 12 24s4.2-.533 6.04-1.6a11.793 11.793 0 0 0 4.36-4.36C23.467 16.2 24 14.187 24 12s-.533-4.2-1.6-6.04a11.793 11.793 0 0 0-4.36-4.36C16.2.533 14.187 0 12 0zm5.2 15.28l-1.92 1.92L12 13.84 8.72 17.2 6.8 15.28 10.16 12 6.8 8.72 8.72 6.8 12 10.08l3.28-3.28 1.92 1.92L13.92 12l3.28 3.28z"/>
                   </svg>
                </button>
             </div>

             <h2 id="filters-popup-title" className=" ml-5 mr-3  text-lg">Filters</h2>

             <FilterSectionContainer title="Search">
                <div className="relative mt-4">
                   <svg aria-hidden="true" className="absolute left-2 top-2"  viewBox="0 0 24 24" width="24px" height="24px" fill="none">
                      <path stroke="currentColor" strokeWidth="1.5"
                            d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
                   </svg>
                   <input  type="text" aria-label="Search products" value={tempFilters.search ?? ""}
                           onChange={(event) => {
                              const search = event.target.value
                              setTempFilters((prev) => ({...prev, search}))
                           }}
                           className="bg-gray-100  pl-9 pr-5 w-full outline-black text-base focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 py-2 rounded-full" placeholder="Search"/>
                </div>
             </FilterSectionContainer>

             <FilterSectionContainer title="Sort By">
                <div role="radiogroup" aria-label="Sort By" className="flex flex-col gap-3 mt-4">
                   {SORT_OPTIONS.map((option, index) => (
                       <div className="flex items-center cursor-pointer" key={option}>
                          <input type="radio" id={`sortByInput${index}`} className="h-5 w-5" name="sortBy" value={option}
                                 checked={tempFilters.sortBy === option}
                                 onChange={() => setTempFilters((prev) => ({...prev, sortBy: option}))}/>
                          <label htmlFor={`sortByInput${index}`} className="ml-3 cursor-pointer">{option}</label>
                       </div>
                   ))}
                </div>
             </FilterSectionContainer>

             <FilterSectionContainer title="Sale">
                <SectionOptions options={SALE_OPTIONS} category="sale" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Price">
                <SectionOptions options={PRICE_RANGES} category="price" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Category">
                <SectionOptions options={CATEGORY_OPTIONS} category="category" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Gender">
                <SectionOptions options={GENDER_OPTIONS} category="gender" handleChange={handleChange} tempFilters={tempFilters}/>
             </FilterSectionContainer>

             <FilterSectionContainer title="Sizes">
                <div role="group" aria-label="Sizes" className="flex flex-wrap gap-2 mt-4">
                   {ALL_SIZES.map((size) =>  (
                       <button type="button" key={size} aria-pressed={tempFilters.sizes.includes(size)} onClick={() => toggleSize(size)}
                               className={`flex items-center justify-center h-[46px] w-[75px] cursor-pointer border-2 ${tempFilters.sizes.includes(size) ? "border-black" : " border-gray-300"}   rounded-lg  transition-all duration-100`}>
                         <span className="select-none ">
                            {size}
                         </span>
                       </button>
                   ))}
                </div>

             </FilterSectionContainer>


             <div className="sticky h-16 overflow-y-hidden bottom-0 px-2 w-full bg-gray-100  flex gap-4 pt-2 pb-[52px] justify-between">
                <button type="button" className="h-[39px]  bg-white w-full rounded-2xl  border-[1.5px] border-gray-300" onClick={clearFilters}>
                   Clear ({filtersCount})
                </button>
                <button type="button" className="h-[39px] w-full rounded-2xl bg-black text-white " onClick={applyFilters}>
                   Apply
                </button>
             </div>

          </div>

   );
};

export default FiltersPopup;

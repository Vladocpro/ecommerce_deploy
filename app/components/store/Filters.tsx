"use client"

import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch} from "react-redux";
import debounce from "lodash.debounce"
import {setFiltersPopup} from "../../redux/slices/modals";
import Tooltip from "../Tooltip";
import {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";
import DropDownSortBy from "../dropdown/DropDownSortBy";
import {SORT_OPTIONS} from "../../constants";

const Filters = () => {
   const router = useRouter()
   const params = useSearchParams()
   const urlSearch = params?.get("search") ?? ""
   const [searchValue, setSearchValue] = useState<string>(urlSearch)
   // The last value this input wrote to the URL
   const [pushedSearch, setPushedSearch] = useState<string | null>(null)
   const dispatch = useDispatch()

   // Keep the input in sync when the URL changes from elsewhere (reset, mobile filters, back button).
   // Our own debounced update is skipped: the input already shows it, or something newer typed since.
   const [syncedUrlSearch, setSyncedUrlSearch] = useState<string>(urlSearch)
   if (urlSearch !== syncedUrlSearch) {
      setSyncedUrlSearch(urlSearch)
      if (urlSearch !== pushedSearch) setSearchValue(urlSearch)
   }

   // Created once; reads the current URL when it fires instead of params captured at creation
   const updateSearchParam = useMemo(() => debounce((value: string) => {
      const search = value.trim() ? value : ""
      setPushedSearch(search)
      const updatedQuery = {
         ...qs.parse(window.location.search),
         search: search || undefined,
         // New results: start again from the first page
         page: undefined
      }
      // replace, not push: one history entry per search instead of one per pause in typing
      router.replace(qs.stringifyUrl({url: "/store", query: updatedQuery}, {skipNull: true}))
   }, 1000), [router]);

   useEffect(() => () => updateSearchParam.cancel(), [updateSearchParam]);

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setSearchValue(e.target.value);
      updateSearchParam(e.target.value);
   }

   const resetFilters = () => {
      updateSearchParam.cancel()
      setPushedSearch(null)
      setSearchValue("")
      router.replace("/store")
   }


   return (
       <div className="flex items-center justify-between mt-3 mb-5">
          <div className="hidden lg:flex gap-[110px]">
             <span className="inline-block text-xl ml-1.5 font-medium  mx-auto">Filters</span>
             <Tooltip text="Reset Filters" onClick={resetFilters} containerStyles="headerSvg after:h-[135%] after:w-[135%] after:left-[-4.5px] after:top-[-4.75px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer" viewBox="0 0 24 24" aria-hidden="true"
                     strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                   <path d="M8 4h12v2.172a2 2 0 0 1 -.586 1.414l-3.914 3.914m-.5 3.5v4l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227"/>
                   <path d="M3 3l18 18"/>
                </svg>
             </Tooltip>

          </div>
          <button type="button" aria-haspopup="dialog" className="lg:hidden cursor-pointer flex items-center justify-center border-2 lg:border-0 rounded-full py-1 px-4 ml-auto lg:ml-0"
               onClick={() => dispatch(setFiltersPopup(true))}>
             <span className="text-xl font-medium  mx-auto">Filters</span>
             <svg className="block lg:hidden ml-1.5" focusable="false" viewBox="0 -1 22 22" aria-hidden="true"
                  width="26px" height="26px" fill="none">
                <path stroke="currentColor" strokeWidth="1.5" d="M21 8.25H10m-5.25 0H3"></path>
                <path stroke="currentColor" strokeWidth="1.5" d="M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd"></path>
                <path stroke="currentColor" strokeWidth="1.5" d="M3 15.75h10.75m5 0H21"></path>
                <path stroke="currentColor" strokeWidth="1.5" d="M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd"></path>
             </svg>
          </button>

          <div className="hidden lg:flex items-center">
             <div className="relative">
                <svg aria-hidden="true" className="absolute left-7 top-2"  viewBox="0 0 24 24" width="24px" height="24px" fill="none">
                   <path stroke="currentColor" strokeWidth="1.5"
                         d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
                </svg>
                <input type="text" aria-label="Search products" onChange={handleChange} id="search" value={searchValue} className="bg-gray-100 outline-black  pl-9 pr-5 focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 mx-5 py-2 rounded-full mr-10 " placeholder="Search"/>
             </div>
                <DropDownSortBy isExpanded={false} itemStyles="px-5 hover:bg-black hover:text-white py-1 text-gray-700 font-medium" containerStyles="flex flex-col min-w-max shadow-xl bg-gray-100" options={SORT_OPTIONS}/>
          </div>

       </div>
   );
};

export default Filters;

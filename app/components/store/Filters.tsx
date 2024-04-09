"use client"

import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import debounce from "lodash.debounce"
import {setFiltersPopup} from "../../redux/slices/modals";
import Tooltip from "../Tooltip";
import {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";
import DropDownSortBy from "../dropdown/DropDownSortBy";

const Filters = () => {

   const [searchValue, setSearchValue] = useState<string>("")
   const router = useRouter()
   const params = useSearchParams()
   const dispatch = useDispatch()
   const inputRef = useRef<HTMLInputElement | null>(null)


   useEffect(() => {
      let currentQuery = {};
      if(params) {
         currentQuery = qs.parse(params.toString())
      }

      let updatedQuery: any = Object.assign({}, currentQuery)
      if(searchValue === "") {
         updatedQuery.search = null
      } else {
         updatedQuery.search = searchValue
      }

      const url = qs.stringifyUrl({
         url: "/store",
         query: updatedQuery
      }, {skipNull: true})

      router.push(url)
   }, [searchValue]);


   const debouncedSearch = debounce((text) => {
      setSearchValue(text);
   }, 500);

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      debouncedSearch(e.target.value);
   }

   useEffect(() => {
      if (inputRef.current === null) return
      const paramSearchValue = params?.get("search")
      if(paramSearchValue === "" || paramSearchValue === null || paramSearchValue === undefined) {
         setSearchValue("")
         inputRef.current.value = ""
      } else {
         setSearchValue(paramSearchValue)
         inputRef.current.value = paramSearchValue
      }

   }, [params]);


   return (
       <div className="flex items-center justify-between mt-3 mb-5">

          <div className="hidden lg:flex gap-[110px]">
             <span className="inline-block text-xl ml-1.5 font-medium  mx-auto">Filters</span>

             <Tooltip text="Resert Filters" onClick={() => router.replace("/store")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer" viewBox="0 0 24 24"
                     strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                   <path d="M8 4h12v2.172a2 2 0 0 1 -.586 1.414l-3.914 3.914m-.5 3.5v4l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227"/>
                   <path d="M3 3l18 18"/>
                </svg>
             </Tooltip>

          </div>
          <div className="lg:hidden cursor-pointer flex items-center justify-center border-2 lg:border-0 rounded-full py-1 px-4 ml-auto lg:ml-0"
               onClick={() => dispatch(setFiltersPopup(true))}>
             <span className="text-xl font-medium  mx-auto">Filters</span>
             <svg className="block lg:hidden ml-1.5" focusable="false" viewBox="0 -1 22 22" role="img"
                  width="26px" height="26px" fill="none">
                <path stroke="currentColor" strokeWidth="1.5" d="M21 8.25H10m-5.25 0H3"></path>
                <path stroke="currentColor" strokeWidth="1.5" d="M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd"></path>
                <path stroke="currentColor" strokeWidth="1.5" d="M3 15.75h10.75m5 0H21"></path>
                <path stroke="currentColor" strokeWidth="1.5" d="M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd"></path>
             </svg>
          </div>

          <div className="hidden lg:flex items-center">
             <div className="relative">
                <svg aria-hidden="true" className="absolute left-7 top-2"  viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                   <path stroke="currentColor" strokeWidth="1.5"
                         d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
                </svg>
                <input ref={inputRef} type="text" onChange={(e) => handleChange(e)} className="bg-gray-100 outline-black  pl-9 pr-5 focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 mx-5 py-2 rounded-full mr-10 " placeholder="Search"/>
             </div>
             <DropDownSortBy isExpanded={false} itemStyles="px-5" containerStyles="flex flex-col gap-[3px] min-w-max shadow-xl bg-gray-100 px-1 py-2" sortBy={[null,"desc", "asc"]} options={["Featured","Price: High-Low", "Price: Low-High"]}/>
          </div>

       </div>
   );
};

export default Filters;

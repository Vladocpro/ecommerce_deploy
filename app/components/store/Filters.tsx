"use client"

import React, {useEffect, useState} from 'react';
import DropDownSelect from "../dropdown/DropDownSelect";
import {useDispatch} from "react-redux";
import {setSearch} from "../../redux/slices/filters";
import debounce from "lodash.debounce"
import {setFiltersPopup} from "../../redux/slices/modals";

const Filters = () => {

   const [searchValue, setSearchValue] = useState<string>("")
   const dispatch = useDispatch()


   useEffect(() => {
      dispatch(setSearch(searchValue))
   }, [searchValue]);


   const debouncedSearch = debounce((text) => {
      setSearchValue(text);
   }, 500);

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      debouncedSearch(e.target.value);
   }


   return (
       <div className="flex items-center justify-between mt-3 mb-5">

             <span className="hidden lg:inline-block ml-12 text-xl font-medium  mx-auto">Filters</span>

          <div className="lg:hidden cursor-pointer flex items-center justify-center border-2 lg:border-0 rounded-full py-1 px-4 ml-auto lg:ml-0" onClick={() => dispatch(setFiltersPopup(true))}>
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
                <input  type="text" onChange={(e) => handleChange(e)} className="bg-gray-100 outline-black  pl-9 pr-5 focus:placeholder:text-gray-900 hover:placeholder:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 mx-5 py-2 rounded-full mr-10 " placeholder="Search"/>
             </div>
             <DropDownSelect isExpanded={false} changeTittle={true} title="Sort By" titleStyles="text-lg font-medium" itemStyles="px-5" containerStyles="flex flex-col gap-[3px] min-w-max shadow-xl bg-gray-100 px-1 py-2" sortBy={[null,"desc", "asc"]} options={["Featured","Price: High-Low", "Price: Low-High"]}/>
          </div>

       </div>
   );
};

export default Filters;

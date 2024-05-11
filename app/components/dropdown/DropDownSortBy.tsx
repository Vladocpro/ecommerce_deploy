"use client"

import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import useClickOutside from "../useClickOutside";
import qs from "query-string";

interface DropDownSelectProps {
   containerStyles? :string,
   itemStyles? :string,
   constTitle?: string,
   svgStyles?: string,
   svgBox?: string,
   isExpanded: boolean,
   options: any[]
}


const DropDownSelect: FC<DropDownSelectProps> = ({ svgStyles, svgBox, itemStyles,containerStyles, isExpanded,  options}) => {
   const params = useSearchParams()
   const router = useRouter()
   const [isOpen, setIsOpen] = useState<boolean>(isExpanded)
   const [dropDownTitle, setDropDownTitle] = useState<string>(params?.get("sortBy") || "Sort By")
   const dropdownRef = useRef<HTMLDivElement | null>(null)
   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });

   const pushParam = (title: string) => {
      if(title === "" || title === "Sort By") {
         return
      }
      let currentQuery = {};
      if(params) {
         currentQuery = qs.parse(params.toString())
      }

      let updatedQuery: any = Object.assign({}, currentQuery)
      if(updatedQuery.sortBy === "Sort By") {
         delete updatedQuery.sortBy
      } else {
         updatedQuery.sortBy = title
      }

      const url = qs.stringifyUrl({
         url: "/store",
         query: updatedQuery
      }, {skipNull: true})

      router.push(url)
   };

   useEffect(() => {
      const tempSortBy = params?.get("sortBy")
      if(!tempSortBy || tempSortBy === "") {
         setDropDownTitle("Sort By")
      } else {
         setDropDownTitle(tempSortBy)
      }
   }, [params]);

   return (
       <div className="relative" ref={dropdownRef}>

          <div className="flex gap-3 items-center px-1 cursor-pointer select-none " onClick={() => setIsOpen(!isOpen)}>
             <div className="text-lg font-medium">{dropDownTitle}</div>
             <div className={`relative w-8 h-8 ${svgBox}`}>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] left-0.5    ${!isOpen ? "rotate-45" :  "-rotate-45"} ${svgStyles} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] right-1   ${!isOpen ? "-rotate-45" : "rotate-45"}    ${svgStyles}    transition-all duration-300 bg-black`}/>
             </div>
          </div>

          <div className={`${isOpen ? "translate-y-2  opacity-100 visible pointer-events-auto" : "-translate-y-5 opacity-0 invisible pointer-events-none"} ${containerStyles} transition-all duration-300  rounded-lg select-none  absolute right-1`}>
             {options.map((item, index) => (
                 <div key={index} onClick={() => {
                    setIsOpen(!isOpen)
                    setDropDownTitle(item)
                    pushParam(item);
                 }} className={` cursor-pointer  ${itemStyles} rounded-md`}>
                    {item}
                 </div>
             ))}
          </div>
       </div>
   );
};

export default DropDownSelect;

"use client"

import React, {FC, useRef, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import useClickOutside from "../useClickOutside";
import qs from "query-string";

interface DropDownSortByProps {
   containerStyles? :string,
   itemStyles? :string,
   svgStyles?: string,
   svgBox?: string,
   isExpanded: boolean,
   options: string[]
}


const DropDownSortBy: FC<DropDownSortByProps> = ({ svgStyles, svgBox, itemStyles,containerStyles, isExpanded,  options}) => {
   const params = useSearchParams()
   const router = useRouter()
   const [isOpen, setIsOpen] = useState<boolean>(isExpanded)
   const sortBy = params?.get("sortBy") || "Sort By"
   const [dropDownTitle, setDropDownTitle] = useState<string>(sortBy)
   // Follow the URL when it changes (reset, back button); adjusting state during render avoids an extra effect pass
   const [syncedSortBy, setSyncedSortBy] = useState<string>(sortBy)
   if (sortBy !== syncedSortBy) {
      setSyncedSortBy(sortBy)
      setDropDownTitle(sortBy)
   }
   const dropdownRef = useRef<HTMLDivElement | null>(null)
   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });

   const pushParam = (sortBy: string) => {
      // A new order changes what is on each page: start again from the first one
      const updatedQuery = {...qs.parse(params?.toString() ?? ""), sortBy, page: undefined}
      router.push(qs.stringifyUrl({url: "/store", query: updatedQuery}, {skipNull: true}))
   };

   return (
       <div className="relative" ref={dropdownRef}>

          <button type="button" aria-expanded={isOpen} className="flex gap-3 items-center px-1 cursor-pointer select-none " onClick={() => setIsOpen(!isOpen)}>
             <div className="text-lg font-medium">{dropDownTitle}</div>
             <div className={`relative w-8 h-8 ${svgBox ?? ""}`} aria-hidden="true">
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] left-0.5    ${!isOpen ? "rotate-45" :  "-rotate-45"} ${svgStyles ?? ""} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] right-1   ${!isOpen ? "-rotate-45" : "rotate-45"}    ${svgStyles ?? ""}    transition-all duration-300 bg-black`}/>
             </div>
          </button>

          <div className={`${isOpen ? "translate-y-2  opacity-100 visible pointer-events-auto" : "-translate-y-5 opacity-0 invisible pointer-events-none"} ${containerStyles ?? ""} transition-all duration-300  rounded-lg select-none  absolute right-1`}>
             {options.map((item) => (
                 <button type="button" key={item} onClick={() => {
                    setIsOpen(false)
                    setDropDownTitle(item)
                    pushParam(item);
                 }} className={`text-left cursor-pointer  ${itemStyles ?? ""} rounded-md`}>
                    {item}
                 </button>
             ))}
          </div>
       </div>
   );
};

export default DropDownSortBy;

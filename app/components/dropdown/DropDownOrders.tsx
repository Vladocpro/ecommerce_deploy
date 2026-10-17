"use client"

import React, {FC, useRef, useState} from 'react';
import useClickOutside from "../useClickOutside";

interface DropDownSelectProps {
   containerStyles? :string,
   handleChange: (sortBy: string) => void,
   itemStyles? :string,
   svgStyles?: string,
   svgBox?: string,
   value:string,
   isExpanded: boolean,
   options: string[]
}


const DropDownOrders: FC<DropDownSelectProps> = ({ svgStyles,value,  svgBox,handleChange, itemStyles,containerStyles, isExpanded,  options}) => {
   const [isOpen, setIsOpen] = useState<boolean>(isExpanded)
   const dropdownRef = useRef<HTMLDivElement | null>(null)
   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });


   return (
       <div className="relative hidden sm:block" ref={dropdownRef}>

          <button type="button" aria-expanded={isOpen} className="flex gap-3 items-center pl-1 cursor-pointer select-none " onClick={() => setIsOpen(!isOpen)}>
             <div className="text-lg font-medium">{value}</div>
             <div className={`relative w-8 h-8 ${svgBox ?? ""}`} aria-hidden="true">
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] left-0.5    ${!isOpen ? "rotate-45" :  "-rotate-45"} ${svgStyles ?? ""} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] right-1   ${!isOpen ? "-rotate-45" : "rotate-45"}    ${svgStyles ?? ""}    transition-all duration-300 bg-black`}/>
             </div>
          </button>

          <div className={`${isOpen ? "translate-y-2  opacity-100 visible pointer-events-auto" : "-translate-y-5 opacity-0 invisible pointer-events-none"} ${containerStyles ?? ""} transition-all duration-300  rounded-lg select-none  absolute right-1`}>
             {options.map((item) => (
                 <button type="button" key={item} onClick={() => {
                    setIsOpen(false)
                    handleChange(item)
                 }} className={`text-left cursor-pointer hover:text-gray-400 ${itemStyles ?? ""} rounded-md`}>
                    {item}
                 </button>
             ))}
          </div>
       </div>
   );
};

export default DropDownOrders;

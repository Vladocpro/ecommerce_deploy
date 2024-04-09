"use client"

import React, {FC, useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import useClickOutside from "../useClickOutside";

interface DropDownSelectProps {
   title: string,
   titleStyles?: string,
   containerStyles? :string,
   itemStyles? :string,
   constTitle?: string,
   svgStyles?: string,
   svgBox?: string,
   itemClick?: (quantity : number) => void,
   changeTittle: boolean,
   isExpanded: boolean,
   sortBy?: any[]
   options: any[]
}


const DropDownSelect: FC<DropDownSelectProps> = ({title, titleStyles, changeTittle, itemClick, svgStyles, svgBox, itemStyles, constTitle,containerStyles, isExpanded, sortBy,  options}) => {

   const [dropDownTitle, setDropDownTitle] = useState<string>(title)
   const [isOpen, setIsOpen] = useState<boolean>(isExpanded)
   const dispatch = useDispatch()
   const dropdownRef = useRef<HTMLDivElement | null>(null)

   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });

   return (
       <div className="relative" ref={dropdownRef}>

          <div className="flex gap-3 items-center px-1 cursor-pointer select-none " onClick={() => setIsOpen(!isOpen)}>
             <div className={titleStyles}>{changeTittle ? dropDownTitle : title}</div>
             <div className={`relative w-8 h-8 ${svgBox}`}>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] left-0.5    ${!isOpen ? "rotate-45" :  "-rotate-45"} ${svgStyles} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] right-1   ${!isOpen ? "-rotate-45" : "rotate-45"}    ${svgStyles}    transition-all duration-300 bg-black`}/>
             </div>
          </div>

          <div className={`${isOpen ? "translate-y-2  opacity-100 visible pointer-events-auto" : "-translate-y-5 opacity-0 invisible pointer-events-none"} ${containerStyles} transition-all duration-300  rounded-lg select-none  absolute right-1`}>
             {options.map((item, index) => (
                 <div key={index} onClick={() => {
                    setDropDownTitle(constTitle !== undefined ? constTitle + item : item)
                    setIsOpen(!isOpen)
                    if (itemClick) {
                       itemClick(Number(item))
                    }
                 }}
                      className={` cursor-pointer hover:text-gray-400 ${itemStyles} rounded-md`}
                 >
                    {item}
                 </div>
             ))}
          </div>
       </div>
   );
};

export default DropDownSelect;

"use client"

import React, {FC, useRef, useState} from 'react';
import useClickOutside from "../useClickOutside";
import useNotify from "../useNotify";

interface DropDownSelectProps {
   title: string,
   titleStyles?: string,
   containerStyles? :string,
   constTitle?: string,
   limitQuantity: number,
   svgBox?: string,
   itemClick?: (quantity : number) => void,
   // When false the title always comes from the `title` prop (controlled by the parent)
   changeTittle: boolean,
   isExpanded: boolean,
   options: (string | number)[]
}


const DropDownSelect: FC<DropDownSelectProps> = ({title, titleStyles, changeTittle, itemClick, limitQuantity, svgBox, constTitle,containerStyles, isExpanded,  options}) => {

   const [dropDownTitle, setDropDownTitle] = useState<string>(title)
   const [isOpen, setIsOpen] = useState<boolean>(isExpanded)
   const notify = useNotify()
   const dropdownRef = useRef<HTMLDivElement | null>(null)

   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });

   return (
       <div className="relative" ref={dropdownRef}>

          <button type="button" aria-expanded={isOpen} className="flex gap-1 sm:gap-3 items-center cursor-pointer select-none " onClick={() => setIsOpen(!isOpen)}>
             <div className={titleStyles}>{changeTittle ? dropDownTitle : title}</div>
             <div className={`relative w-8 h-8 ${svgBox ?? ""}`} aria-hidden="true">
                <hr className={`absolute h-[2px] w-3 sm:h-[2.5px] sm:w-4 rounded-xl bottom-[14px] sm:bottom-[13px] left-1.5 sm:left-0.5    ${!isOpen ? "rotate-45" :  "-rotate-45"} bg-gray-500 transition-all duration-300`}/>
                <hr className={`absolute h-[2px] w-3 sm:h-[2.5px] sm:w-4 rounded-xl bottom-[14px] sm:bottom-[13px] right-1.5 sm:right-1   ${!isOpen ? "-rotate-45" : "rotate-45"}    bg-gray-500    transition-all duration-300`}/>
             </div>
          </button>

          <div className={`${isOpen ? "translate-y-2  opacity-100 visible pointer-events-auto" : "-translate-y-5 opacity-0 invisible pointer-events-none"} ${containerStyles ?? ""} transition-all duration-300  rounded-lg select-none  absolute right-1`}>
             {options.map((item) => (
                 <button type="button" key={item} onClick={() => {
                    if(limitQuantity < Number(item)) {
                       notify.error(`Only ${limitQuantity} size quantity available!`)
                       return
                    }
                    setDropDownTitle(constTitle !== undefined ? constTitle + item : String(item))
                    setIsOpen(false)
                    if (itemClick) {
                       itemClick(Number(item))
                    }
                 }}
                      className={`block w-full text-center cursor-pointer py-[3px] sm:py-0.5 px-5 hover:bg-black font-medium hover:text-white rounded-md`}
                 >
                    {item}
                 </button>
             ))}
          </div>
       </div>
   );
};

export default DropDownSelect;

"use client"

import React, {FC, useRef, useState} from 'react';
import useClickOutside from "../useClickOutside";

interface DropDownSelectProps {
   selectedOption: string,
   handleChange: (option: string) => void;
   options: string[]
}


const DropDownAdmin: FC<DropDownSelectProps> = ({ selectedOption,handleChange,  options}) => {
   const [isOpen, setIsOpen] = useState<boolean>(false)
   const dropdownRef = useRef<HTMLDivElement | null>(null)
   useClickOutside(dropdownRef, () => {
      setIsOpen(false);
   });

   return (
       <div className="relative" ref={dropdownRef}>

          <button type="button" aria-expanded={isOpen} className="flex gap-3 items-center px-1 cursor-pointer select-none w-full text-left" onClick={() => setIsOpen(!isOpen)}>
             <div className="text-lg font-medium">{selectedOption}</div>
             <div className={`relative w-8 h-8`} aria-hidden="true">
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] left-0.5    ${!isOpen ? "rotate-45" :  "-rotate-45"} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] right-1   ${!isOpen ? "-rotate-45" : "rotate-45"} transition-all duration-300 bg-black`}/>
             </div>
          </button>

          <div className={`${isOpen ? "translate-y-2  opacity-100 visible pointer-events-auto" : "-translate-y-5 opacity-0 invisible pointer-events-none"} transition-all duration-300  rounded-lg select-none bg-gray-100 shadow-xl absolute left-1 z-13 `}>
             {options.map((item) => (
                 <button type="button" key={item} onClick={() => {
                    setIsOpen(false)
                    handleChange(item);
                 }} className={`block w-full text-left cursor-pointer rounded-md px-5 hover:bg-black hover:text-white py-1 text-gray-700 font-medium`}>
                    {item}
                 </button>
             ))}
          </div>
       </div>
   );
};

export default DropDownAdmin;

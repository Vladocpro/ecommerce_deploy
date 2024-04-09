"use client"

import React, {FC} from 'react';

interface DropDownProps {
   title: string,
   titleStyles?: string,
   containerStyles?: string,
   svgStyles?: string,
   svgBox?: string,
   isOpen: boolean,
   setIsOpen: (bool : boolean) => void,
   children: React.ReactNode
}

const DropDown: FC<DropDownProps> = ({title, titleStyles, svgStyles, containerStyles, svgBox, isOpen, setIsOpen,  children}) => {

   return (
       <div className="relative">

          <div className="flex gap-3 items-center px-1 cursor-pointer select-none " onClick={() => setIsOpen(!isOpen)}>
             <div className={titleStyles}>{title}</div>
             <div className={`relative w-8 h-8 ${svgBox}`}>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] left-0.5    ${!isOpen ? "rotate-45" :  "-rotate-45"} ${svgStyles} transition-all duration-300 bg-black`}/>
                <hr className={`absolute h-[2.5px] w-4 rounded-xl bottom-[13px] right-1   ${!isOpen ? "-rotate-45" : "rotate-45"}    ${svgStyles}    transition-all duration-300 bg-black`}/>
             </div>
          </div>

          <div className={`${isOpen ? "translate-y-2  opacity-100 visible" : "-translate-y-5 opacity-0 invisible  "} ${containerStyles} transition-all duration-300  rounded-lg select-none  absolute right-1`}>
             {children}
          </div>
       </div>
   );
};

export default DropDown;

"use client"

import { useState, ReactNode } from "react";

interface TooltipProps {
   children: ReactNode;
   text: string;
   textStyles?: string;
   containerStyles?: string;
   onClick?: () => void;
}

function Tooltip({ children, text, textStyles, containerStyles, onClick }: TooltipProps) {
   const [showTooltip, setShowTooltip] = useState(false);

   const handleMouseEnter = () => {
       setShowTooltip(true)
   };

   const handleMouseLeave = () => {
      setShowTooltip(false);
   };

   return (
       <div
           className={`relative inline-flex justify-center ${containerStyles}`}
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={onClick}
       >
          {children}
              <span onMouseEnter={handleMouseLeave} className={`absolute z-30 top-full text-sm font-medium delay-300 whitespace-nowrap transform-all  ${showTooltip ? "translate-y-2 opacity-100 visible" : "delay-0 -translate-y-2 opacity-0 invisible"} ${textStyles}  duration-300 cursor-default bg-transparent text-black py-1 px-3 rounded-md`}>
                 {text}
              </span>
       </div>
   );
}

export default Tooltip;

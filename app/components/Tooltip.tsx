"use client"

import { useState, ReactNode } from "react";

interface TooltipProps {
   children: ReactNode;
   text: string;
   // Accessible name of the button, defaults to the tooltip text
   ariaLabel?: string;
   textStyles?: string;
   containerStyles?: string;
   onClick?: () => void;
}

function Tooltip({ children, text, ariaLabel, textStyles, containerStyles, onClick }: TooltipProps) {
   const [showTooltip, setShowTooltip] = useState(false);

   const show = () => setShowTooltip(true);
   const hide = () => setShowTooltip(false);

   return (
       <button
           type="button"
           aria-label={ariaLabel ?? text}
           className={`relative inline-flex justify-center ${containerStyles ?? ""}`}
           onMouseEnter={show}
           onMouseLeave={hide}
           onFocus={show}
           onBlur={hide}
           onClick={onClick}
       >
          {children}
              <span aria-hidden="true" onMouseEnter={hide} className={`absolute z-30 top-full text-sm font-medium delay-300 whitespace-nowrap transform-all  ${showTooltip ? "translate-y-2 opacity-100 visible" : "delay-0 -translate-y-2 opacity-0 invisible"} ${textStyles ?? ""}  duration-300 cursor-default bg-transparent text-black py-1 px-3 rounded-md`}>
                 {text}
              </span>
       </button>
   );
}

export default Tooltip;

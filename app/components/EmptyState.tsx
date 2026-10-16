import React from "react";
import Image from "next/image";

export const emptyStateButtonStyles = "bg-black text-white font-bold text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mt-2 sm:mt-6 hover:bg-gray-700"

interface EmptyStateProps {
   title: string,
   className?: string,
   children?: React.ReactNode
}

// "Nothing here" block used by the store, cart, favorites and orders pages
const EmptyState = ({title, className = "h-full", children}: EmptyStateProps) => {
   return (
       <div className={`flex flex-col gap-1 justify-center items-center w-full ${className}`}>
          <Image src="/empty-box.png" alt="" width={96} height={96} className="h-16 w-16 sm:h-24 sm:w-24"/>
          <span className="text-xl sm:text-3xl font-medium">{title}</span>
          {children}
       </div>
   );
};

export default EmptyState;

"use client"

import React from 'react';
import Link from "next/link";

const Error = ({error, reset} : {error: Error, reset: () => void}) => {

   return (
       <div className="flex flex-col justify-center items-center h-full">
          <span className="text-2xl">Sorry, there was a problem!</span>
          <span className="text-2xl mb-10">Please try again later or contact support if the problem persists.</span>
          <div className="flex gap-7">
             <button className="mt-3 text-xl font-medium px-7 py-1 border-[2px] border-black rounded-lg bg-black text-white transition-all duration-300"
                     onClick={reset}>Try again
             </button>
             <Link href="/" className="mt-3 text-xl font-medium px-7 py-1 border-[2px] border-black rounded-lg bg-black text-white transition-all duration-300">
                Go Back Home
             </Link>
          </div>
       </div>
   );
};

export default Error;

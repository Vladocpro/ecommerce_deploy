import React from 'react';
import Link from "next/link";

const HOME = () => {
   return (
       <div className="flex flex-col justify-center items-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="64px" height="64px" fillRule="nonzero">
             <g fill="black" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDashoffset="0"><g transform="scale(2,2)">
                <path d="M64,6c-15.5,0 -30.1,6 -41,17c-11,10.9 -17,25.5 -17,41c0,15.5 6,30.1 17,41c11,11 25.5,17 41,17c15.5,0 30.1,-6 41,-17c11,-11 17,-25.5 17,-41c0,-15.5 -6,-30.1 -17,-41c-10.9,-11 -25.5,-17 -41,-17zM64,12c13.9,0 26.90078,5.39922 36.80078,15.19922c9.9,9.8 15.19922,22.90078 15.19922,36.80078c0,13.9 -5.39922,26.90078 -15.19922,36.80078c-9.9,9.8 -22.90078,15.19922 -36.80078,15.19922c-13.9,0 -26.90078,-5.39922 -36.80078,-15.19922c-9.9,-9.8 -15.19922,-22.90078 -15.19922,-36.80078c0,-13.9 5.39922,-26.90078 15.19922,-36.80078c9.8,-9.9 22.90078,-15.19922 36.80078,-15.19922zM50.5625,47.5c-0.7625,0 -1.5125,0.30039 -2.0625,0.90039c-1.2,1.2 -1.2,3.09922 0,4.19922l11.30078,11.40039l-11.40039,11.30078c-1.2,1.2 -1.2,3.09922 0,4.19922c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039l11.40039,-11.30078l11.30078,11.30078c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039c1.2,-1.2 1.2,-3.09922 0,-4.19922l-11.30078,-11.30078l11.30078,-11.30078c1.2,-1.2 1.19961,-3.09883 0.09961,-4.29883c-1.2,-1.2 -3.09922,-1.2 -4.19922,0l-11.40039,11.40039l-11.30078,-11.40039c-0.6,-0.6 -1.37422,-0.90039 -2.13672,-0.90039z"/>
             </g></g>
          </svg>
             <span className="text-2xl font-medium">Payment was declined</span>
          <Link href="/" className="mt-3 text-xl font-medium px-7 py-1 border-[2px] border-black rounded-lg bg-black text-white transition-all duration-300">Go Home</Link>
       </div>
   );
};

export default HOME;

"use client"

import React, {FC, useEffect, useMemo, useState} from 'react';
import {setAuthPopup} from "../../redux/slices/modals";
import Tooltip from "../Tooltip";
import AuthButton from "./AuthButton";
import {User} from "../../types";
import { useRouter } from "next/navigation";
import {useDispatch} from "react-redux";

interface NavLinkProps {
   user : User | null
}


const NavLinks: FC<NavLinkProps> =  ({user})  => {
      const router = useRouter();
      const dispatch = useDispatch()


   const cartQuantity = useMemo(() => {
      if(user === undefined || user === null) return ""
      if(user.cart.length === 0) return ""
      if(user.cart.length > 99 ) {
         return "99"
      } else {
         return user.cart.length
      }
   },[user?.cart.length])

   return (
       <div className="hidden gap-4 items-center lg:flex">
          {
             user?.role === "Admin" ? (
                 <Tooltip text="Admin Panel" onClick={() => user !== null ? router.push("/adminPanel") : dispatch(setAuthPopup(true))}>
                    <div className="headerSvg after:h-[135%] after:w-[135%] after:top-[-4px] after:left-[-5px]">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 stroke-[1.25px] stroke-black fill-none">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                       </svg>
                    </div>
                 </Tooltip>
             ) : null
          }
          <Tooltip text="Favorites" onClick={() => user !== null ? router.push("/favorites") : dispatch(setAuthPopup(true))}>
             <div className="headerSvg">
                <svg viewBox="0 0 471.701 471.701" height={24}>
                   <path className="  cursor-pointer"
                         d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                </svg>
             </div>
          </Tooltip>

          <Tooltip text="My Orders" onClick={() => user !== null ? router.push("/orders") : dispatch(setAuthPopup(true))}>
             <div className="headerSvg">
                <svg viewBox="0 0 24 24" height={24} fill="black">
                   <line className="cls-1" x1="10" y1="7.5" x2="18" y2="7.5"/>
                   <line className="cls-1" x1="10" y1="11.5" x2="18" y2="11.5"/>
                   <line className="cls-1" x1="10" y1="15.5" x2="18" y2="15.5"/>
                   <line className="cls-1" x1="8" y1="7.5" x2="6" y2="7.5"/>
                   <line className="cls-1" x1="8" y1="11.5" x2="6" y2="11.5"/>
                   <line className="cls-1" x1="8" y1="15.5" x2="6" y2="15.5"/>
                   <polygon className="cls-2" points="4 22.5 6.66 20.5 9.33 22.5 11.99 20.5 14.66 22.5 17.33 20.5 20 22.5 21 21.5 21 1.5 3 1.5 3 21.5 4 22.5"/>
                </svg>
             </div>
          </Tooltip>

          <Tooltip text="Cart" onClick={() => user !== null ? router.push("/cart") : dispatch(setAuthPopup(true))}>
             <div className="relative">
                <span
                    className="absolute top-[65%] right-[50%] translate-x-1/2 -translate-y-1/2 text-xs z-13 font-medium select-none pointer-events-none bg-opacity-40 rounded-full">{cartQuantity}</span>
                <div className="headerSvg after:top-[-4px]">
                   <svg viewBox="0 0 32 32" height={24} fill="black">
                      <path fill="currentColor" className="cursor-pointer"
                            d="M28 9.25h-5.25v-1.117c0.004-0.087 0.006-0.189 0.006-0.292 0-3.643-2.953-6.596-6.596-6.596-0.082 0-0.164 0.002-0.246 0.004l0.012-0c-0.035-0.001-0.076-0.001-0.117-0.001-3.627 0-6.568 2.941-6.568 6.568 0 0.114 0.003 0.226 0.009 0.338l-0.001-0.016v1.111h-5.25c-1.518 0.002-2.748 1.232-2.75 2.75v14c0.003 2.622 2.128 4.747 4.75 4.75h20c2.622-0.003 4.747-2.128 4.75-4.75v-14c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM10.75 8.133c-0.007-0.096-0.010-0.208-0.010-0.322 0-2.797 2.267-5.064 5.064-5.064 0.047 0 0.095 0.001 0.142 0.002l-0.007-0c0.066-0.003 0.143-0.005 0.22-0.005 2.816 0 5.1 2.283 5.1 5.1 0 0.104-0.003 0.207-0.009 0.309l0.001-0.014v1.111h-10.5zM29.25 26c-0.001 1.794-1.456 3.249-3.25 3.25h-20c-1.794-0.002-3.248-1.456-3.25-3.25v-14c0.001-0.69 0.56-1.249 1.25-1.25h5.25v6.25c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-6.25h10.5v6.25c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-6.25h5.25c0.69 0.001 1.249 0.56 1.25 1.25v0z"/>
                   </svg>
                </div>
             </div>
          </Tooltip>
          {
             user ?
                 <AuthButton isLogin={false}/>
                 :
                 <AuthButton isLogin={true}/>
          }
       </div>
   );
};

export default NavLinks;

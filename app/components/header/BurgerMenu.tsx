"use client"

import React, {useState} from 'react';
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {signOut} from "next-auth/react";
import {setAuthPopup} from "../../redux/slices/modals";


const BurgerMenu = () => {

   const [burgerVisible, setBurgerVisible] = useState<boolean>(false)
   const isAuth= useSelector((state : RootState) => state.auth.user)
   const dispatch = useDispatch();


   return (
       <div className="block mr-5  sm:hidden">
          <div className="block relative cursor-pointer z-13 sm:hidden  h-[18px] w-[24px]  after:top-[-9px] after:left-[-8px] after:h-[200%] after:w-[165%] space-y-1.5 " onClick={() => setBurgerVisible(!burgerVisible)}>
             <hr className={`headerBurgerLine ${burgerVisible && "rotate-45  translate-y-[0.5rem] "}`}/>
             <hr className={`headerBurgerLine mx-auto ${burgerVisible ? "w-[1%]" : "w-[100%]" }`}/>
             <hr className={`headerBurgerLine ${burgerVisible && "rotate-[-45deg] translate-y-[-0.5rem] "}`}/>
          </div>
          <div className={`absolute z-10 inset-0 transition-all duration-300 h-screen w-screen opacity-[45%] burgerBlockingLayer ${burgerVisible ? "visible" : "invisible opacity-0"}`} onClick={() => setBurgerVisible(!burgerVisible)}/>
          <div className={`fixed z-10 right-0 top-0 h-screen   transition-all duration-300 bg-white opacity-100  ${burgerVisible ? "w-screen visible" : "invisible"} h-full w-[0] space-y-1.5 `}>
             <div className="flex flex-col ml-10 mr-10 h-full text-left overflow-hidden text-2xl mt-16">
                <Link href="/store" onClick={() => setBurgerVisible(false)} className="headerBurgerLink justify-between mt-3">
                   <span>Store</span>
                   <svg aria-hidden="true" className="headerSvg" viewBox="0 0 24 24" height={29} fill="none">
                      <path stroke="currentColor"  d="M8.474 18.966L15.44 12 8.474 5.033"/>
                   </svg>
                </Link>
                <Link href="/sales" onClick={() => setBurgerVisible(false)} className="headerBurgerLink justify-between mt-3">
                   <span>Sales</span>
                   <svg aria-hidden="true" className="headerSvg" viewBox="0 0 24 24" height={29} fill="none">
                      <path stroke="currentColor"  d="M8.474 18.966L15.44 12 8.474 5.033"/>
                   </svg>
                </Link>
                <Link href="/cart" onClick={() => setBurgerVisible(false)} className="headerBurgerLink justify-between mt-3">
                   <span>Cart</span>
                   <div  className="after:top-[-4px] mr-1">
                      <svg  viewBox="0 0 32 32" height={24} fill="black">
                         <path fill="currentColor" className="cursor-pointer" d="M28 9.25h-5.25v-1.117c0.004-0.087 0.006-0.189 0.006-0.292 0-3.643-2.953-6.596-6.596-6.596-0.082 0-0.164 0.002-0.246 0.004l0.012-0c-0.035-0.001-0.076-0.001-0.117-0.001-3.627 0-6.568 2.941-6.568 6.568 0 0.114 0.003 0.226 0.009 0.338l-0.001-0.016v1.111h-5.25c-1.518 0.002-2.748 1.232-2.75 2.75v14c0.003 2.622 2.128 4.747 4.75 4.75h20c2.622-0.003 4.747-2.128 4.75-4.75v-14c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM10.75 8.133c-0.007-0.096-0.010-0.208-0.010-0.322 0-2.797 2.267-5.064 5.064-5.064 0.047 0 0.095 0.001 0.142 0.002l-0.007-0c0.066-0.003 0.143-0.005 0.22-0.005 2.816 0 5.1 2.283 5.1 5.1 0 0.104-0.003 0.207-0.009 0.309l0.001-0.014v1.111h-10.5zM29.25 26c-0.001 1.794-1.456 3.249-3.25 3.25h-20c-1.794-0.002-3.248-1.456-3.25-3.25v-14c0.001-0.69 0.56-1.249 1.25-1.25h5.25v6.25c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-6.25h10.5v6.25c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-6.25h5.25c0.69 0.001 1.249 0.56 1.25 1.25v0z"/>
                      </svg>
                   </div>
                </Link>
                <Link href="/favorites" onClick={() => setBurgerVisible(false)} className="headerBurgerLink justify-between mt-3">
                   <span>Favorites</span>
                   <div  className="mr-1">
                      <svg viewBox="0 0 471.701 471.701" height={24}  >
                         <path  className="cursor-pointer" d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                      </svg>
                   </div>
                </Link>
                <Link href="/orders" onClick={() => setBurgerVisible(false)} className="headerBurgerLink justify-between mt-3">
                   <span>Orders</span>
                   <div  className="mr-1">
                      <svg  viewBox="0 0 24 24"  height={24} fill="black">
                         <line className="cls-1" x1="10" y1="7.5" x2="18" y2="7.5"/>
                         <line className="cls-1" x1="10" y1="11.5" x2="18" y2="11.5"/>
                         <line className="cls-1" x1="10" y1="15.5" x2="18" y2="15.5"/>
                         <line className="cls-1" x1="8" y1="7.5" x2="6" y2="7.5"/>
                         <line className="cls-1" x1="8" y1="11.5" x2="6" y2="11.5"/>
                         <line className="cls-1" x1="8" y1="15.5" x2="6" y2="15.5"/>
                         <polygon className="cls-2" points="4 22.5 6.66 20.5 9.33 22.5 11.99 20.5 14.66 22.5 17.33 20.5 20 22.5 21 21.5 21 1.5 3 1.5 3 21.5 4 22.5"/>
                      </svg>
                   </div>
                </Link>
                <hr className="h-[2.5px] rounded-md bg-black mt-5"/>
                <div className="headerBurgerLink justify-between mt-3" onClick={() => {
                   setBurgerVisible(false)
                   if (isAuth)
                      signOut()
                   else
                     dispatch(setAuthPopup(true))
                }}>
                   <span>{isAuth ? "Log out" : "Log in"}</span>
                   {
                      isAuth ?
                          <Link href="/" className="mr-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="logInSvg">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                             </svg>
                          </Link>
                          :
                          <Link href="/"  className="mr-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  className="logInSvg">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                             </svg>
                          </Link>
                   }
                </div>
             </div>
          </div>
       </div>
   );
};

export default BurgerMenu;

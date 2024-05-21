"use client"

import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {closeToastPopup, ToastType} from "../redux/slices/modals";


function Toast() {
   const toast = useSelector((state : RootState) => state.modals.toastPopup)
   const dispatch = useDispatch()

   const ToastIcon = () => {
      switch (toast.type) {
         case ToastType.ERROR: {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                   <path fillRule="evenodd"
                         d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                         clipRule="evenodd"/>
                </svg>
            )
         }
         case ToastType.SUCCESS: {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                   <path fillRule="evenodd"
                         d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                         clipRule="evenodd"/>
                </svg>

            )
         }
      }
   }

   useEffect(() => {
        const timer = setTimeout(() => dispatch(closeToastPopup()), toast.duration);
        return () => clearTimeout(timer);
   }, [toast.visible]);

   return (
       <div
           className={`fixed flex items-center gap-2 cursor-default z-30 ${toast.position} p-2.5 ${toast.type} whitespace-nowrap text-white rounded-lg transition-all duration-300 ${toast.visible ? "visible opacity-100 translate-y-0" : "-translate-y-8 opacity-0 invisible"}`}
           onClick={() => dispatch(closeToastPopup())}
       >
             <ToastIcon/>
             <p className="inline-block font-medium">{typeof toast.message === "string" ? toast.message : "Internal Server Error"}</p>
       </div>
   );
}
export default Toast

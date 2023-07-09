"use client"

import React, {FC} from 'react';
import Link from "next/link";
import {setAuthPopup} from "../../redux/slices/modals";
import Tooltip from "../Tooltip";
import {useDispatch} from "react-redux";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";

interface AuthButtonProps {
   isLogin : boolean,
}
// @ts-ignore
const AuthButton : FC<AuthButtonProps> = ({isLogin}) => {

   const dispatch = useDispatch();
   const router = useRouter()

   if(isLogin) return (
       <Tooltip text="Log in" onClick={() => dispatch(setAuthPopup(true))}>
          <div  className="headerSvg after:left-[-4px] after:top-[-5px]" >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  className="logInSvg">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
             </svg>
          </div>
       </Tooltip>
   );

   if(!isLogin) return (
       <Tooltip text="Log out" onClick={() => signOut()}>
          <div  className="headerSvg after:left-[-8px] after:top-[-5px]" >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="logInSvg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
             </svg>
          </div>
       </Tooltip>
   )
};

export default AuthButton;

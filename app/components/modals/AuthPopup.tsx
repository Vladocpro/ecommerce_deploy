"use client"

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAuthPopup, setToastPopup, ToastPositions, ToastType} from "../../redux/slices/modals";
import {useForm} from "react-hook-form";
import {LoginForm} from "../../types";
import {postFetch} from "../../../lib/fetcher";
import {signIn} from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthPopup = () => {
   const router = useRouter();
   const authPopup : boolean = useSelector((state : RootState) => state.modals.authPopup)
   const [isRegister, setIsRegister] = useState<boolean>(false);

   const {register, handleSubmit, reset, clearErrors, formState: {errors, isValid}} = useForm({
      defaultValues: {
         email: '',
         password: '',
         repPassword: ''
      },
      mode: 'onChange'
   })

   const dispatch = useDispatch();
   const onSubmit = async (values : LoginForm) => {
      const {repPassword, ...data} = values
      try {

         if (isRegister) await postFetch('/api/auth/register', data).then((response) => {
            if(response.error)  dispatch(setToastPopup({visible: true, message: response.error, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            dispatch(setToastPopup({visible: true, message: response.message, position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 2500}))
         });

         signIn('credentials', {
            ...data,
            redirect: false
         }).then((callback) => {
            if(callback?.ok) {
               dispatch(setToastPopup({visible: true, message: "Authenticated", position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 2500}))
               router.refresh()
               closePopup();
            }
            if(callback?.error) {
                  dispatch(setToastPopup({visible: true, message: callback.error, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
            }
         })

      } catch (e : any) {
         console.log(e)
      }
   }


   const closePopup = () => {
      dispatch(setAuthPopup(false));
      reset()
   }

   useEffect(() => {
      if(authPopup) {
         setIsRegister(false);
      }
   }, [authPopup]);


   return (
       <div className={`flex items-center justify-center fixed z-20 inset-0 transition-all duration-500 ${authPopup ? "visible" : "invisible opacity-0"}`}>
          <div className={`absolute inset-0  bg-[rgba(111,111,111,0.2)] transition-all duration-500 h-full w-full ${authPopup ? "visible" : "invisible opacity-0"}`} onClick={closePopup}/>
          <form
              className={`relative  w-80 sm:w-[500px] py-5 flex flex-col bg-white rounded-lg transition-all duration-500 ${authPopup ? "translate-y-0" : "-translate-y-32 opacity-0"}`}
              onSubmit={handleSubmit(onSubmit)}>

             {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"*/}
             {/*     className="w-6 h-6 absolute top-4 right-3 cursor-pointer sm:hidden">*/}
             {/*   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>*/}
             {/*</svg>*/}

             {/*<span className="absolute font-semibold text-xl top-3 right-4 cursor-pointer" onClick={closePopup}>X</span>*/}
             <img src={"/nike-square.png"} className="h-12 w-12 mx-auto"/>
             <span className="mx-auto text-xl mt-1 font-semibold">Welcome to Ecom</span>
             <span className="mx-auto text-gray-500 ">{!isRegister ? "Log into" : "Create"} your account to get started</span>
             {/*<span className="mx-auto text-xl font-semibold">{!isRegister ? "Login" : "Sign up"}</span>*/}
             <input placeholder="Email" type="text" id="email"
                    {...register('email', {
                       required: 'Specify Email',
                       minLength: {value: 11, message: "Please enter valid Email"},
                       pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Specify valid Email"}
                    })}
                    className={`mt-6 mx-5 p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300 ${errors.email && "focus:outline-none border-red-500"}`}/>
             <label htmlFor="email" className={`text-red-500 ml-6 mr-5 block text-xs opacity-0 ${errors.email?.message !== undefined ? "opacity-100 h-4" : "h-1.5"}`}>
                {errors.email?.message}
             </label>
             <input placeholder="Password" type="password" id="password"
                    {...register('password', {
                       required: 'Specify Password',
                       minLength: {value: 5, message: "At least 5 characters"},
                       maxLength: {value: 20, message: "Not more than 20 characters"}
                    })}
                    className={`mt-[4px] mx-5 p-2 h-12 outline-black ${errors.password && "focus:outline-none border-red-500"} rounded-lg border-[1.75px] border-gray-300`}/>
             <label htmlFor="password"
                    className={`text-red-500 ml-6 mr-5 block text-xs opacity-0 ${errors.password?.message !== undefined ? "opacity-100 h-4" : "h-1.5"}`}>
                {errors.password?.message}
             </label>
             {isRegister
                 && (
                     <>
                        <input placeholder="Repeat Password" type="password" id="repPassword"
                               {...register('repPassword', {
                                  required: 'Specify Password',
                                  minLength: {value: 5, message: "At least 5 characters"},
                                  maxLength: {value: 20, message: "Not more than 20 characters"},
                                  validate: (value, formValues) => {
                                     if (formValues.password !== value) return "Passwords should match!"
                                  }
                               })}
                               className={`mt-[4px] mx-5 p-2 h-12 outline-black ${errors.repPassword && "focus:outline-none border-red-500"} rounded-lg border-[1.75px] border-gray-300`}/>
                        <label htmlFor="repPassword"
                               className={`text-red-500 ml-6 mr-5 h-4 block text-xs opacity-0 ${errors.repPassword?.message !== undefined && "opacity-100"}`}>
                           {errors.repPassword?.message}
                        </label>
                     </>
                 )}
             <button type="submit" className="py-3 mx-5 mt-2 font-medium rounded-lg bg-black  text-white ">
                {!isRegister ? "Log in" : "Create Account"}
             </button>
             <div className="flex items-center mt-3 mx-5">
                <hr className="h-[1px] w-full bg-gray-300"/>
                <span className="mx-2 text-sm text-gray-500">OR</span>
                <hr className="h-[1px] w-full bg-gray-300"/>
             </div>
             <button
                 className="relative py-2 mx-5 mt-3 px-4  border-2 border-black font-medium rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                 type="button" onClick={() => signIn('google')}>
                <img src="../../HomePage/googleIcon.png" className="absolute left-1 h-6 w-6" alt=""/>
                Continue with Google
             </button>
             <span className="text-center mt-4 cursor-pointer text-gray-500" onClick={() => {
                setIsRegister(!isRegister)
                reset()
                clearErrors()
             }}>{!isRegister ? "Don't" : "Already"} have an account? <span
                 className="text-black font-semibold">{!isRegister ? "Sign Up" : "Sign In"}</span></span>
          </form>
       </div>

   )
};

export default AuthPopup;

"use client"

import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import {RootState} from "../../redux/store";
import {setAuthPopup, setToastPopup, ToastPositions, ToastType} from "../../redux/slices/modals";
import {useForm} from "react-hook-form";
import {LoginForm} from "../../types";
import {postFetch} from "../../../lib/fetcher";
import {signIn} from "next-auth/react";
import { useRouter } from "next/navigation";
import useDialog from "./useDialog";

const AuthPopup = () => {
   const router = useRouter();
   const authPopup : boolean = useSelector((state : RootState) => state.modals.authPopup)
   const [isRegister, setIsRegister] = useState<boolean>(false);
   const dialogRef = useRef<HTMLDivElement | null>(null);

   const {register, handleSubmit, reset, clearErrors, formState: {errors}} = useForm({
      defaultValues: {
         email: 'demo@gmail.com',
         password: '123456',
         repPassword: ''
      },
      mode: 'onChange'
   })

   const dispatch = useDispatch();
   const showToast = (message: string, type: ToastType) => {
      dispatch(setToastPopup({visible: true, message, position: ToastPositions.AUTH, type, duration: type === ToastType.ERROR ? 5000 : 2500}))
   }

   const onSubmit = async (values : LoginForm) => {
      const {repPassword, ...data} = values

      if (isRegister) {
         try {
            await postFetch('/api/auth/register', data)
         } catch (error: any) {
            // Stop here: signing in with an email that couldn't be registered makes no sense
            showToast(error?.response?.data?.error ?? "Couldn't create your account", ToastType.ERROR)
            return
         }
      }

      const callback = await signIn('credentials', {
         ...data,
         redirect: false
      })
      if (callback?.error) {
         showToast(callback.error, ToastType.ERROR)
         return
      }
      if (callback?.ok) {
         showToast(isRegister ? "Account created" : "Authenticated", ToastType.SUCCESS)
         router.refresh()
         closePopup();
      }
   }


   const closePopup = () => {
      dispatch(setAuthPopup(false));
      reset()
   }
   useDialog(authPopup, closePopup, dialogRef)

   // Every time the popup opens it starts on the login form (state adjusted during render, not in an effect)
   const [wasOpen, setWasOpen] = useState<boolean>(authPopup);
   if (authPopup !== wasOpen) {
      setWasOpen(authPopup);
      if (authPopup) setIsRegister(false);
   }


   return (
       <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="auth-popup-title"
            className={`flex items-center justify-center fixed z-20 inset-0 transition-all duration-500 ${authPopup ? "visible" : "invisible opacity-0"}`}>
          <div aria-hidden="true" className={`absolute inset-0  bg-[rgba(111,111,111,0.2)] transition-all duration-500 h-full w-full ${authPopup ? "visible" : "invisible opacity-0"}`} onClick={closePopup}/>
          <form
              noValidate
              className={`relative  w-80 sm:w-[500px] py-5 flex flex-col bg-white rounded-lg transition-all duration-500 ${authPopup ? "translate-y-0" : "-translate-y-32 opacity-0"}`}
              onSubmit={handleSubmit(onSubmit)}>

             <button type="button" aria-label="Close" onClick={closePopup}
                     className="absolute top-3 right-3 text-gray-500 hover:text-black transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
             </button>
             <Image src="/nike-square.png" alt="" width={48} height={48} className="h-12 w-12 mx-auto"/>
             <h2 id="auth-popup-title" className="mx-auto text-xl mt-1 font-semibold">Welcome to Ecom</h2>
             <span className="mx-auto text-gray-500 ">{!isRegister ? "Log into" : "Create"} your account to get started</span>
             <label htmlFor="email" className="sr-only">Email</label>
             <input placeholder="Email" type="email" id="email" autoComplete="email" data-autofocus
                    aria-invalid={errors.email ? true : undefined} aria-describedby="email-error"
                    {...register('email', {
                       required: 'Specify Email',
                       minLength: {value: 11, message: "Please enter valid Email"},
                       pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Specify valid Email"}
                    })}
                    className={`mt-6 mx-5 p-2 h-12 outline-black  rounded-lg border-[1.75px] border-gray-300 ${errors.email && "focus:outline-none border-red-500"}`}/>
             <p id="email-error" className={`text-red-500 ml-6 mr-5 block text-xs opacity-0 ${errors.email?.message !== undefined ? "opacity-100 h-4" : "h-1.5"}`}>
                {errors.email?.message}
             </p>
             <label htmlFor="password" className="sr-only">Password</label>
             <input placeholder="Password" type="password" id="password" autoComplete={isRegister ? "new-password" : "current-password"}
                    aria-invalid={errors.password ? true : undefined} aria-describedby="password-error"
                    {...register('password', {
                       required: 'Specify Password',
                       minLength: {value: 5, message: "At least 5 characters"},
                       maxLength: {value: 20, message: "Not more than 20 characters"}
                    })}
                    className={`mt-[4px] mx-5 p-2 h-12 outline-black ${errors.password && "focus:outline-none border-red-500"} rounded-lg border-[1.75px] border-gray-300`}/>
             <p id="password-error"
                    className={`text-red-500 ml-6 mr-5 block text-xs opacity-0 ${errors.password?.message !== undefined ? "opacity-100 h-4" : "h-1.5"}`}>
                {errors.password?.message}
             </p>
             {isRegister
                 && (
                     <>
                        <label htmlFor="repPassword" className="sr-only">Repeat Password</label>
                        <input placeholder="Repeat Password" type="password" id="repPassword" autoComplete="new-password"
                               aria-invalid={errors.repPassword ? true : undefined} aria-describedby="repPassword-error"
                               {...register('repPassword', {
                                  required: 'Specify Password',
                                  minLength: {value: 5, message: "At least 5 characters"},
                                  maxLength: {value: 20, message: "Not more than 20 characters"},
                                  validate: (value, formValues) => {
                                     if (formValues.password !== value) return "Passwords should match!"
                                  }
                               })}
                               className={`mt-[4px] mx-5 p-2 h-12 outline-black ${errors.repPassword && "focus:outline-none border-red-500"} rounded-lg border-[1.75px] border-gray-300`}/>
                        <p id="repPassword-error"
                               className={`text-red-500 ml-6 mr-5 h-4 block text-xs opacity-0 ${errors.repPassword?.message !== undefined && "opacity-100"}`}>
                           {errors.repPassword?.message}
                        </p>
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
                <Image src="/HomePage/googleIcon.png" alt="" width={24} height={24} className="absolute left-1 h-6 w-6"/>
                Continue with Google
             </button>
             <button type="button" className="text-center mt-4 cursor-pointer text-gray-500" onClick={() => {
                setIsRegister(!isRegister)
                // Demo credentials prefill only the login form
                isRegister ? reset() : reset({email: '', password: '', repPassword: ''})
                clearErrors()
             }}>{!isRegister ? "Don't" : "Already"} have an account? <span
                 className="text-black font-semibold">{!isRegister ? "Sign Up" : "Sign In"}</span></button>
          </form>
       </div>

   )
};

export default AuthPopup;

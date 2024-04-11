"use client"

import React, {useState} from 'react';
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
      setIsRegister(false);
      reset()
   }


   return (
       <div className={`flex items-center justify-center fixed z-20 inset-0 transition-all duration-500 ${authPopup ? "visible" : "invisible opacity-0"}`}>
          <div className={`absolute inset-0  bg-[rgba(111,111,111,0.2)] transition-all duration-500 h-full w-full ${authPopup ? "visible" : "invisible opacity-0"}`} onClick={closePopup}/>
          <form className={`relative  w-80 py-5 flex flex-col bg-white rounded-lg transition-all duration-500 ${authPopup ? "translate-y-0" : "-translate-y-32 opacity-0"}`} onSubmit={ handleSubmit(onSubmit)}>
             <span className="absolute font-semibold text-xl top-3 right-4 cursor-pointer" onClick={closePopup}>X</span>
             <span className="mx-auto mt-1 text-lg font-semibold">{!isRegister ? "Login" : "Sign up"}</span>
             <input placeholder="Email"    type="text" id="email"
                    {...register('email', {required: 'Specify Email', minLength: {value: 11, message: "Specify valid Email"},  pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Specify valid Email"}})}
                    className={`mt-6 mx-5 p-2 h-12 outline-black  rounded-md border-2 border-gray-300 ${errors.email && "focus:outline-none border-red-500"}`}/>
                 <label htmlFor="email" className={`text-red-500 ml-6 mr-5 h-4 block text-xs opacity-0 ${errors.email?.message !== undefined && "opacity-100"}`}>
                     {errors.email?.message}
                  </label>
             <input placeholder="Password" type="password" id="password"
                    {...register('password', {required: 'Specify Password', minLength: {value:5, message: "At least 5 characters"}, maxLength: {value:20, message: "Not more than 20 characters"}})}
                    className={`mt-[4px] mx-5 p-2 h-12 outline-black ${errors.password && "focus:outline-none border-red-500"} rounded-md border-2 border-gray-300`}/>
                 <label htmlFor="password" className={`text-red-500 ml-6 mr-5 h-4 block text-xs opacity-0 ${errors.password?.message !== undefined && "opacity-100"}`}>
                     {errors.password?.message}
                  </label>
             {isRegister
                 && (
                     <>
                        <input placeholder="Repeat Password" type="password" id="repPassword"
                               {...register('repPassword', {required: 'Specify Password', minLength: {value:5, message: "At least 5 characters"}, maxLength:{value:20, message: "Not more than 20 characters"}, validate: (value, formValues) => {
                                     if(formValues.password !== value) return "Passwords should match!"
                                  }})}
                               className={`mt-[4px] mx-5 p-2 h-12 outline-black ${errors.repPassword && "focus:outline-none border-red-500"} rounded-md border-2 border-gray-300`}/>
                        <label htmlFor="repPassword" className={`text-red-500 ml-6 mr-5 h-4 block text-xs opacity-0 ${errors.repPassword?.message !== undefined && "opacity-100"}`}>
                           {errors.repPassword?.message}
                        </label>
                     </>
                )}
             <button type="submit" className="py-[6px] mx-5 mt-2  rounded-lg bg-black text-white ">
                {!isRegister ? "Log in" : "Sign up"}
             </button>
             <button type="reset" className="py-[4px] mx-5 mt-3 px-4 border-2 border-black  rounded-lg  transition-all duration-300" onClick={() => {
                setIsRegister(!isRegister)
                reset()
                clearErrors()
             }}>
                {!isRegister ? "Create Account" : "Back to login"}
             </button>
             <button className="relative py-[4px] mx-5 mt-3 px-4  border-2 border-black  rounded-lg hover:bg-black hover:text-white transition-all duration-300" type="button" onClick={() => signIn('google')}>
                <img src="../../HomePage/googleIcon.png" className="absolute left-1 h-6 w-6" alt=""/>
                Continue with Google
             </button>
          </form>
       </div>

   )
};

export default AuthPopup;

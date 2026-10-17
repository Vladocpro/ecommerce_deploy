"use client"

import {useMemo} from "react";
import {useDispatch} from "react-redux";
import axios from "axios";
import {setAuthPopup, setToastPopup, ToastPositions, ToastType} from "../redux/slices/modals";

const DEFAULT_ERROR = "Something went wrong, please try again"

// API routes answer failures with `{error: string}` and a non-2xx status, which axios throws
export const getErrorMessage = (error: unknown, fallback: string = DEFAULT_ERROR): string => {
   if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error
      if (typeof message === "string" && message !== "") return message
   }
   return fallback
}

export const isUnauthorized = (error: unknown): boolean => axios.isAxiosError(error) && error.response?.status === 401

// Toast helpers shared by the client components that call the API
const useNotify = () => {
   const dispatch = useDispatch()

   return useMemo(() => {
      const success = (message: string) => {
         dispatch(setToastPopup({visible: true, message, position: ToastPositions.AUTH, type: ToastType.SUCCESS, duration: 2500}))
      }
      const error = (message: string) => {
         dispatch(setToastPopup({visible: true, message, position: ToastPositions.AUTH, type: ToastType.ERROR, duration: 5000}))
      }
      // A 401 means the session is gone: ask the user to log in instead of showing a toast
      const requestError = (err: unknown, fallback?: string) => {
         if (isUnauthorized(err)) {
            dispatch(setAuthPopup(true))
            return
         }
         error(getErrorMessage(err, fallback))
      }
      return {success, error, requestError}
   }, [dispatch])
}

export default useNotify;

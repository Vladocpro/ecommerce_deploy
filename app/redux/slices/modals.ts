import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../types";


export enum ToastPositions  {
   AUTH = 'inline-block self-center top-5 left-1/2 translate-x-[-50%]',
   RIGHT=  ""
}
export enum ToastType  {
   SUCCESS = "bg-black",
   ERROR   = "bg-red-700",
   BLACK   = "bg-black",
}

export interface ToastPayload {
   visible:  boolean,
   message: string,
   duration?: number,
   position: ToastPositions,
   type: ToastType,
}
interface toastPopup extends ToastPayload {
   // Bumped on every setToastPopup so the toast restarts its timer even when one is already visible
   id: number,
}
interface selectSizePopup {
   isOpen:  boolean,
   product: Product | null
}

interface modalState {
   authPopup: boolean,
   filtersPopup: boolean,
   toastPopup: toastPopup,
   selectSizePopup: selectSizePopup
}

const DEFAULT_TOAST_DURATION = 3000

const initialState : modalState = {
   authPopup: false,
   filtersPopup: false,
   toastPopup: {
      id: 0,
      visible:  false ,
      message: "",
      duration: DEFAULT_TOAST_DURATION,
      position: ToastPositions.AUTH,
      type: ToastType.SUCCESS,
   },
   selectSizePopup: {
      isOpen: false,
      product: null
   }
};


const modalsSlice = createSlice({
   name: 'modals',
   initialState,
   reducers: {
      setAuthPopup: (state, action: PayloadAction<boolean>) => {
         state.authPopup = action.payload;
      },
      setSelectSizePopup: (state, action: PayloadAction<selectSizePopup>) => {
         state.selectSizePopup.isOpen = action.payload.isOpen;
         state.selectSizePopup.product = action.payload.product;
      },
      setToastPopup: (state, action: PayloadAction<ToastPayload>) => {
         state.toastPopup.id += 1;
         state.toastPopup.message = action.payload.message;
         state.toastPopup.position = action.payload.position;
         state.toastPopup.type = action.payload.type;
         state.toastPopup.duration = action.payload.duration ?? DEFAULT_TOAST_DURATION;
         state.toastPopup.visible = action.payload.visible;
      },
      setFiltersPopup: (state, action: PayloadAction<boolean>) => {
         state.filtersPopup = action.payload
      },
      closeToastPopup: (state) => {
         state.toastPopup.visible = false;
      },
      closeSelectSizePopup: (state) => {
         state.selectSizePopup.isOpen = false;
         state.selectSizePopup.product = null;
      },
   },
})

export const modalsReducer = modalsSlice.reducer

export const {setAuthPopup, setFiltersPopup, setSelectSizePopup, setToastPopup, closeToastPopup, closeSelectSizePopup} = modalsSlice.actions;

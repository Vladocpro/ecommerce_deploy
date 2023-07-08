import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {Product, User} from "../../types";


interface toastPopup {
      visible:  boolean,
      message: string,
      duration?: number,
      position: ToastPositions,
      type: ToastType,

}
interface selectSizePopup {
   isOpen:  boolean,
   product: Product | null
}

export enum ToastPositions  {
   AUTH = "inline-block self-center top-5",
   RIGHT=  ""
}
export enum ToastType  {
   SUCCESS = "bg-green-500",
   ERROR   = "bg-red-500",
   BLACK   = "bg-black",
}

interface modalState {
   authPopup: boolean,
   filtersPopup: boolean,
   toastPopup: toastPopup,
   selectSizePopup: selectSizePopup
}

const initialState : modalState = {
   authPopup: false,
   filtersPopup: false,
   toastPopup: {
      visible:  false ,
      message: "",
      duration: 3000,
      position: ToastPositions.RIGHT,
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
      setToastPopup: (state, action: PayloadAction<toastPopup>) => {
         state.toastPopup.message = action.payload.message;
         state.toastPopup.position = action.payload.position;
         state.toastPopup.type = action.payload.type;
         if(action.payload.duration) state.toastPopup.duration = action.payload.duration;
         state.toastPopup.visible = action.payload.visible;
      },
      setFiltersPopup: (state, action: PayloadAction<boolean>) => {
         state.filtersPopup = action.payload
      },
      closeToastPopup: (state) => {
         state.toastPopup.visible = false;
         // state.toastPopup.message = "";
         state.toastPopup.duration = 3000;
      },
      closeSelectSizePopup: (state) => {
         state.selectSizePopup.isOpen = false;
         state.selectSizePopup.product = null;
      },
   },
})

export const modalsReducer = modalsSlice.reducer

export const {setAuthPopup, setFiltersPopup, setSelectSizePopup, setToastPopup, closeToastPopup, closeSelectSizePopup} = modalsSlice.actions;

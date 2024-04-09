import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../types";




interface productPushPayload  {
   chosenSize: string,
   currentProduct: Product
}
interface productState {
   chosenSizes: string[],
   currentProduct: Product | null
}

const initialState : productState = {
   chosenSizes: [],
   currentProduct: null
};


const productSlice = createSlice({
   name: 'product',
   initialState,
   reducers: {
      pushChosenSize: (state, action: PayloadAction<productPushPayload>) => {
         if(action.payload.currentProduct.id !== state.currentProduct?.id) {
            state.chosenSizes = [action.payload.chosenSize]
            state.currentProduct = action.payload.currentProduct;
         }
         else {
            if(state.chosenSizes.includes(action.payload.chosenSize)) {
               state.chosenSizes = state.chosenSizes.filter((size : string) => size != action.payload.chosenSize)
            }
            else {
               state.chosenSizes = [...state.chosenSizes, action.payload.chosenSize]
            }
         }
      },
      clearChosenSizes: (state) => {
         state.chosenSizes = [];
         state.currentProduct = null;
      },
   },
})

export const productReducer = productSlice.reducer

export const {pushChosenSize, clearChosenSizes} = productSlice.actions;

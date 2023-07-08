import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {Product, User} from "../../types";


interface authState {
   user: User | null,
   products: Product[] | null,

}

const initialState : authState = {
   user: null,
   products:  null,
};


const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      logout: (state) => {
         state.user = null;
      },
      setAuthData: (state, action: PayloadAction<User>) => {
         state.user = action.payload;
      },
   },
})

export const authReducer = authSlice.reducer

export const {logout, setAuthData} = authSlice.actions;

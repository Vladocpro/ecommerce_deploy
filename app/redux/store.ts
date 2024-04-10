import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/auth";
import {modalsReducer} from "./slices/modals";
import {productReducer} from "./slices/product";


export const store = configureStore({
   reducer: {
      auth: authReducer,
      modals: modalsReducer,
      product: productReducer,
   },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

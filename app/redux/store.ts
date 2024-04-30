import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/auth";
import {modalsReducer} from "./slices/modals";


export const store = configureStore({
   reducer: {
      auth: authReducer,
      modals: modalsReducer,
   },
   devTools: false
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

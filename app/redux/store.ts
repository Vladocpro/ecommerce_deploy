import {configureStore} from "@reduxjs/toolkit";
import {modalsReducer} from "./slices/modals";


export const store = configureStore({
   reducer: {
      modals: modalsReducer,
   },
   devTools: false
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

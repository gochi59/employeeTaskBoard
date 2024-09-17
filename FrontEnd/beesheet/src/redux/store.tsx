import { configureStore } from "@reduxjs/toolkit";
import sliceReducer from './HeaderSlice'
export const store=configureStore({
    reducer:sliceReducer,
});
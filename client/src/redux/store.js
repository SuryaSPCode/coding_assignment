import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./companySlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: { 
        companies: companyReducer,
        users: userReducer
    },
});
export default store;

import { configureStore } from '@reduxjs/toolkit';

import authSlice from "./Slices/authSlice"
import userSlice from "./Slices/userSlice"
import uiSlice from "./Slices/uiSlice"

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice,
        user: userSlice,
        ui: uiSlice,
    }
})
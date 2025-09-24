import { configureStore } from '@reduxjs/toolkit';

import authSlice from "./Slices/authSlice"
import userSlice from "./Slices/userSlice"
import uiSlice from "./Slices/uiSlice"
import { paginationApi } from '@/features/auth/paginationApi';

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice,
        user: userSlice,
        ui: uiSlice,

        [paginationApi.reducerPath]: paginationApi.reducer,
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(paginationApi.middleware)
    )
})
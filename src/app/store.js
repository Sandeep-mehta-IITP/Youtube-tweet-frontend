import { configureStore } from '@reduxjs/toolkit';

import authSlice from "./Slices/authSlice"
import userSlice from "./Slices/userSlice"
import uiSlice from "./Slices/uiSlice"
import { videosApi } from '@/features/auth/videosApi';

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice,
        user: userSlice,
        ui: uiSlice,

        [videosApi.reducerPath]: videosApi.reducer,
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(videosApi.middleware)
    )
})
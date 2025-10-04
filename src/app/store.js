import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./Slices/authSlice";
import userSlice from "./Slices/userSlice";
import uiSlice from "./Slices/uiSlice";
import { paginationApi } from "@/features/auth/paginationApi";
import healthCheckSlice from "./Slices/healthCheckSlice";
import playlistSlice from "./Slices/playlistSlice";
import videoSlice from "./Slices/videoSlice";
import { videoApi } from "@/features/auth/videoApi";
import likeSlice from "./Slices/likeSlice";
import commentSlice from "./Slices/commentSlice";
import tweetSlice from "./Slices/tweetSlice"


export const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authSlice,
    user: userSlice,
    ui: uiSlice,
    healthCheck: healthCheckSlice,
    playlist: playlistSlice,
    video: videoSlice,
    like: likeSlice,
    comment: commentSlice,
    tweet: tweetSlice,
    

    [paginationApi.reducerPath]: paginationApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      paginationApi.middleware,
      videoApi.middleware
    ),
});

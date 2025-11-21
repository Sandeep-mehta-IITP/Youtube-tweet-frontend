import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export const paginationApi = createApi({
  reducerPath: "videosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Videos"], // useful for caching
  endpoints: (builder) => ({
    getVideosByOption: builder.query({
      query: (queryData) => {
        const params = { ...queryData };  // Copy to avoid mutation
        if (params.page) params.page = params.page.toString();  // Ensure string for URL
        const queryString =
          "?" +
          Object.entries(params || {})
            .map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&");
        
        const fullUrl = `/videos${queryString}`;
        console.log("API Query URL:", fullUrl);  // Debug log – remove in production
        return fullUrl;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("API Error Details:", err);  // Enhanced logging
          toast.error(err?.error?.data?.message || "Failed to fetch videos");
        }
      },

      providesTags: (result) =>
        result?.data?.docs
          ? [
              ...result.data.docs.map((v) => ({ type: "Videos", id: v._id })), 
              { type: "Videos", id: "LIST" },
            ]
          : [{ type: "Videos", id: "LIST" }],
    }),
  }),
});

export const { useGetVideosByOptionQuery } = paginationApi;
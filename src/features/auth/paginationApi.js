import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export const paginationApi = createApi({
  reducerPath: "videosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Videos"],
  endpoints: (builder) => ({
    getVideosByOption: builder.query({
      query: (queryData) => {
        const params = { ...queryData };
        if (params.page) params.page = params.page.toString();
        const queryString =
          "?" +
          Object.entries(params || {})
            .map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&");
        
        const fullUrl = `/videos${queryString}`;
        console.log("API Query URL:", fullUrl);
        return fullUrl;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("API Error Details:", err);
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
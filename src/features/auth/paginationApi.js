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
        const queryString =
          "?" +
          Object.entries(queryData || {})
            .map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&");

        return `/videos${queryString}`;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          toast.error(err?.error?.data?.message || "Failed to fetch videos");
        }
      },

      providesTags: (result) =>
        result?.videos
          ? [
              ...result.videos.map(({ id }) => ({ type: "Videos", id })),
              { type: "Videos", id: "LIST" },
            ]
          : [{ type: "Videos", id: "LIST" }],
    }),
  }),
});

export const { useGetVideosByOptionQuery } = paginationApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BACKEND_URL,
    credentials: "include",
  }),
  tagTypes: ["Allvideos", "Video"],
  endpoints: (builder) => ({
    // get video
    getVideo: builder.query({
      query: (videoId) => `/videos/${videoId}`,
      providesTags: (result, error, id) => [{ type: "Video", id }],
    }),

    // get all videos
    getAllVideos: builder.query({
      query: (queryData) => {
        const queryString =
          "?" +
          Object.entries(queryData || {})
            .map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&");

        return `/vidoes${queryString}`;
      },
      providesTags: (result) =>
        result?.videos
          ? [
              ...result.videos.map(({ id }) => ({ type: "Video", id })),
              { type: "Video", id: "LIST" },
            ]
          : [{ type: "Video", id: "LIST" }],
    }),
  }),
});

export const { useGetVideoQuery, useGetAllVideosQuery } = videoApi;

import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: { videos: [], pagingInfo: {} },
};

export const getAllVideosByOption = createAsyncThunk(
  "pagingVideos/getAllVideosByOption",
  async ({ ...queryData }, { signal }) => {
    try {
      const queryString =
        "?" +
        Object.entries(queryData)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join("&");

      const controller = new AbortController();
      signal.addEventListener("abort", () => controller.abort());

      const response = await axiosInstance.get(`/videos/${queryString}`, {
        signal: controller.signal,
      });

      console.log("Paging response", response.data);

      return {
        videos: response.data.data.docs,       // ⭐ correct
        pagingInfo: response.data.data         // ⭐ correct
      };

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load videos");
      throw error;
    }
  }
);

const paginationSlice = createSlice({
  name: "pagingVideos",
  initialState,
  reducers: {
    emptyPagingVideosData: (state) => {
      state.data = { videos: [], pagingInfo: {} };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllVideosByOption.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllVideosByOption.fulfilled, (state, action) => {
      state.loading = false;

      const { videos, pagingInfo } = action.payload;

      state.data.videos =
        action.meta.arg.page == 1
          ? videos
          : [...state.data.videos, ...videos];

      state.data.pagingInfo = pagingInfo;
      state.status = true;
    });

    builder.addCase(getAllVideosByOption.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default paginationSlice.reducer;
export const { emptyPagingVideosData } = paginationSlice.actions;

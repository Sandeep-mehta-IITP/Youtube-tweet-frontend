import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "@/API/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: {
    channelStats: null,
    channelVideos: [],
  },
};

export const getChannelStats = createAsyncThunk(
  "dashboard/getChannelStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/dashboard/stats");

      //console.log("channel stats tunk res", response);
      
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCH CHANNEL STATS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetch channel stats.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getChannelVideos = createAsyncThunk(
  "dashboard/getChannelVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/dashboard/videos");
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCH CHANNEL VIDEOS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetch channel videos.");
      return rejectWithValue(error.userMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    // get channel stats
    builder.addCase(getChannelStats.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getChannelStats.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data.channelStats = action.payload;
    });

    builder.addCase(getChannelStats.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // get channel videos
    builder.addCase(getChannelVideos.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getChannelVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data.channelVideos = action.payload;
    });

    builder.addCase(getChannelVideos.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default dashboardSlice.reducer;

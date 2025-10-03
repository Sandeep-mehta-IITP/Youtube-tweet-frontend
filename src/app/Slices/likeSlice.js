import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "@/API/axiosInstance";

const initialState = {
  loading: false,
  status: false,
  data: null,
};

export const getLikedVideos = createAsyncThunk(
  "like/getLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/likes/videos");
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCHED LIKED VIDEOS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetched liked videos.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async ({ qs, toggleLike }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `likes?toggleLike=${toggleLike}&${qs}`
      );
      return response.data;
    } catch (error) {
      console.log("FAILED TO TOGGLE LIKE", error.userMessage);
      toast.error(error.userMessage || "Failed to toggle like.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "like/toggleCommentLike",
  async ({ commentId, toggleLike }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO TOGGLE COMMENT LIKE", error.userMessage);
      toast.error(error.userMessage || "Failed to toggle comment like.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "like/toggleTweetLike",
  async ({ tweetId, toggleLike }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO TOGGLE COMMENT LIKE", error.userMessage);
      toast.error(error.userMessage || "Failed to toggle comment like.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async ({ videoId, toggleLike }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO TOGGLE COMMENT LIKE", error.userMessage);
      toast.error(error.userMessage || "Failed to toggle comment like.");
      return rejectWithValue(error.userMessage);
    }
  }
);

const likeSlice = createSlice({
  name: "Like",
  initialState,
  extraReducers: (builder) => {
    // get liked video
    builder.addCase(getLikedVideos.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getLikedVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(getLikedVideos.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle like or dislike
    builder.addCase(toggleLike.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(toggleLike.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(toggleLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle comment like
    builder.addCase(toggleCommentLike.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(toggleCommentLike.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(toggleCommentLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle tweet like
    builder.addCase(toggleTweetLike.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(toggleTweetLike.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(toggleTweetLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle video like
    builder.addCase(toggleVideoLike.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(toggleVideoLike.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(toggleVideoLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default likeSlice.reducer;

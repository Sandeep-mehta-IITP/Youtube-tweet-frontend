import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: [],
};

export const getUserTweets = createAsyncThunk(
  "tweet/getUserTweets",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tweets/user/${userId}`);

      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCHED USER TWEETS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetched user tweets.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getAllTweets = createAsyncThunk(
  "tweet/getAllTweets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tweets`);
      //console.log("all tweets", response.data.data.docs);
      
      return response?.data?.data?.docs || response.data;
    } catch (error) {
      console.log("FAILED TO FETCHED ALL TWEETS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetched all tweets.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const createTweet = createAsyncThunk(
  "tweet/createTweet",
  async ({ content }, { rejectWithValue }) => {
    console.log(content);

    try {
      const response = await axiosInstance.post(`/tweets`, { content });
      toast.success(response.data.message || "Tweet created successfully !!!");
      return response.data;
    } catch (error) {
      console.log("FAILED TO CREATE TWEET", error.userMessage);
      toast.error(error.userMessage || "Failed to create tweet.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updateTweet = createAsyncThunk(
  "tweet/updateTweet",
  async ({ tweetId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/tweets/${tweetId}`, {content});
      toast.success(response.data.message || "Tweet updated successfully !!!");
      return response.data;
    } catch (error) {
      console.log("FAILED TO UPDATE TWEET", error.userMessage);
      toast.error(error.userMessage || "Failed to update tweet.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "tweet/deleteTweet",
  async (tweetId, { rejectWithValue }) => {
    console.log("tweet ID in tweet slice", tweetId);

    try {
      const response = await axiosInstance.delete(`/tweets/${tweetId}`);
      toast.success(response.data.message || "Tweet deleted successfully !!!");
      return response.data;
    } catch (error) {
      console.log("FAILED TO DELETE TWEET", error);
      toast.error(error.userMessage || "Failed to delete tweet.");
      return rejectWithValue(error.userMessage);
    }
  }
);

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  extraReducers: (builder) => {
    // get user tweets
    builder.addCase(getUserTweets.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getUserTweets.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      const newTweet = action.payload?.tweet || action.payload;
      if (newTweet?._id) {
        state.data = [newTweet, ...state.data];
      }
    });

    builder.addCase(getUserTweets.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // get all tweets
    builder.addCase(getAllTweets.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllTweets.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(getAllTweets.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // create tweet
    builder.addCase(createTweet.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createTweet.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      const newTweet = action.payload?.tweet || action.payload;
      if (newTweet?._id) {
        state.data = [newTweet, ...state.data];
      }
      
    });

    builder.addCase(createTweet.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // update tweet
    builder.addCase(updateTweet.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateTweet.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      const updatedTweet = action.payload?.tweet || action.payload;
      state.data = state.data.map((tweet) =>
        tweet._id === updatedTweet._id ? updatedTweet : tweet
      );

     
    });

    builder.addCase(updateTweet.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // delete tweet
    builder.addCase(deleteTweet.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteTweet.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      const deletedTweetId = action.payload?.tweetId || action.meta.arg;
      state.data = state.data.filter((tweet) => tweet._id !== deletedTweetId);
    });

    builder.addCase(deleteTweet.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default tweetSlice.reducer;

import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: null,
};

export const toggleSubscription = createAsyncThunk(
  "subscription/toggleSubscription",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/subscriptions/c/${channelId}`
      );
      toast.success(
        response.data.message || "Subscription toggled successfully."
      );
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO TOGGLE SUBSCRIPTION", error.userMessage);
      toast.error(error.userMessage || "Failed to toggle subscription.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getChannelSubscribers = createAsyncThunk(
  "subscription/getChannelSubscribers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/subscriptions/c/${channelId}`);
      console.log("res of subs", response.data);
      
      return response.data.data.docs;
    } catch (error) {
      console.log("FAILED TO GET CHANNEL SUBSCRIBERS", error.userMessage);
      toast.error(
        error.userMessage || "Failed to fetched channel subscribers."
      );
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getSubscribedChannels = createAsyncThunk(
  "subscription/getSubscribedChannels",
  async (subscriberId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/subscriptions/u/${subscriberId}`
      );
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO GET SUBSCRIBED CHANNELS", error.userMessage);
      toast.error(
        error.userMessage || "Failed to fetched subscribed channels."
      );
      return rejectWithValue(error.userMessage);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  extraReducers: (builder) => {
    // toggle subscriptions
    builder.addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
    })

    builder.addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.data = action.payload
    })

    builder.addCase(toggleSubscription.rejected, (state) => {
        state.loading = false;
        state.status = false;
    })

    // get channel subscribers
    builder.addCase(getChannelSubscribers.pending, (state) => {
        state.loading = true;
    })

    builder.addCase(getChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.data = action.payload
    })

    builder.addCase(getChannelSubscribers.rejected, (state) => {
        state.loading = false;
        state.status = false;
    })

    // get subscribed channels
    builder.addCase(getSubscribedChannels.pending, (state) => {
        state.loading = true;
    })

    builder.addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.data = action.payload
    })

    builder.addCase(getSubscribedChannels.rejected, (state) => {
        state.loading = false;
        state.status = false;
    })
  },
});

export default subscriptionSlice.reducer;

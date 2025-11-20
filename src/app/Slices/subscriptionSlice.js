import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { channelProfile } from "./userSlice";

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
      //console.log("subscirbers res", response.data);

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
      //console.log("subsriptions res", response.data);
      
      return response.data.data.docs;
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
    });

    builder.addCase(toggleSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      const updatedChannel = action.payload; 

  // Case 1:  (ChannelProfileLayout)
  if (state.data && !Array.isArray(state.data)) {
    if (state.data._id === updatedChannel._id) {
      state.data = { ...state.data, ...updatedChannel };
    }
  }

  // Case 2: (Subscribed / Subscribers tab)
  if (Array.isArray(state.data)) {
    state.data = state.data.map((ch) =>
      ch._id === updatedChannel._id ? { ...ch, ...updatedChannel } : ch
    );
  }
    });

    builder.addCase(toggleSubscription.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // get channel subscribers
    builder.addCase(getChannelSubscribers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getChannelSubscribers.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(getChannelSubscribers.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // get subscribed channels
    builder.addCase(getSubscribedChannels.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getSubscribedChannels.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(getSubscribedChannels.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // NEW: Listen to channelProfile to update the list globally
    builder.addCase(channelProfile.fulfilled, (state, action) => {
      const updatedProfile = action.payload;
      if (Array.isArray(state.data)) {
        state.data = state.data.map((ch) =>
          ch._id === updatedProfile._id ? { ...ch, ...updatedProfile } : ch
        );
      }
    });
  },

  
});

export default subscriptionSlice.reducer;

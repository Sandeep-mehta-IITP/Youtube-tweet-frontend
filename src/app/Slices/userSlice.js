import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/API/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
  userData: {},
  loading: false,
  isAuthenticated: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Override default JSON header
        },
      });
      toast.success("Signup successful! 🎉");
      return response.data;
    } catch (error) {
      const message = error.userMessage || "Signup failed! ❌";
      console.error("Signup failed:", message);
      toast.error(message || "Signup failed! ❌");
      return rejectWithValue(message);
    }
  }
);

export const channelProfile = createAsyncThunk(
  "users/channelProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/c/${username}`);
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCHED CHANNEL PROFILE", error.userMessage);
      toast.error(error.userMessage || "Failed to fetched channel profile.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getAboutChannel = createAsyncThunk(
  "users/getAboutChannel",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/about/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCHED ABOUT CHANNEL", error.userMessage);
      toast.error(error.userMessage || "Failed to fetched about channel.");
      return rejectWithValue(error.userMessage);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    // register user
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      console.log(" register user in user slice", state.userData);

      state.isAuthenticated = true;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userData = null;
      state.error = action.payload;
    });

    // channel profile
    builder.addCase(channelProfile.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(channelProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userData = action.payload;
      //console.log(" channel data in user slice", state.userData);
    });

    builder.addCase(channelProfile.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });

    // get about channel
    builder.addCase(getAboutChannel.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAboutChannel.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userData = action.payload;
      console.log(" channel data in user slice", state.userData);
    });

    builder.addCase(getAboutChannel.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });
  },
});

export default userSlice.reducer;

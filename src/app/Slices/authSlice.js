import { axiosInstance } from "@/API/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userData: null,
  loading: false,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Login successful! 🎉");
      // console.log("login data", response.data);
      // console.log("login", response.data.data);
      // console.log("login user", response.data.data.user);

      return response.data?.data?.user;
    } catch (error) {
      console.log("Login failed:", error.userMessage);
      toast.error(error.userMessage || "Login failed! ❌");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/users/logout", {});
      toast.success("Logged out successfully ... 🎊");
    } catch (error) {
      console.log("LOGOUT FAILED:", error.userMessage);
      toast.error(error.userMessage || "Logout failed ! ❌");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/me", {});
      //  console.log("curent user", response.data);
      //  console.log("current user", response.data.data);

      return response.data?.data;
    } catch (error) {
      console.log("CURRENT USER FETCHED FAILED:", error.userMessage);
      return rejectWithValue(error.userMessage);
    }
  }
);

export const verifyPassword = createAsyncThunk(
  "auth/verifyPassword",
  async (oldPassword, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/verify-password", {
        oldPassword,
      });
      return response.data;
    } catch (error) {
      console.log("FAILED TO VERIFY PASSWORD", error.userMessage);
      return rejectWithValue(error.userMessage);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/users/change-password",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data.message || "Update password successfully !!!"
      );
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO CHANGE PASSWORD", error);
      return rejectWithValue(error.userMessage);
    }
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users/forgot-password", { email });
      toast.success("OTP sent to your email!");
      return res.data;
    } catch (error) {
      console.log("FAILED TO SEND OTP", error.userMessage);
      toast.error(error.userMessage || "Failed to send OTP.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users/verify-otp", { email, otp });
      toast.success("OTP verified!");
      return res.data.data;
    } catch (error) {
      console.log("FAILED TO VERIFIED OTP", error.userMessage);
      toast.error(error.userMessage || "Invalid OTP.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users/reset-password", {
        token,
        newPassword,
      });
      toast.success("Password changed successfully!");
      return res.data;
    } catch (error) {
      console.log("FAILED TO RESET PASSWORD ", error.userMessage);
      toast.error(error.userMessage || "Failed to reset password.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    //console.log("data in update profile slice", data);

    try {
      const response = await axiosInstance.patch(
        "/users/update-details",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Profile updated successfully!!!");
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO UPDATE PROFILE", error.userMessage);
      toast.error(error.userMessage || "Failed to update profile.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/users/update-avatar`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message || "Avatar updated successfully!!!");
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO UPDATE AVATAR", error.userMessage);
      toast.error(error.userMessage || "Failed to update avatar.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  "user/updateCoverImage",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/users/update-coverImage`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(
        response.data.message || "CoverImage updated successfully!!!"
      );
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO UPDATE COVERIMAGE", error.userMessage);
      toast.error(error.userMessage || "Failed to update coverImage.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const watchHistory = createAsyncThunk(
  "user/watchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/history");
      console.log("WatchHistory data", response.data.data);

      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCHED WATCHHISTORY", error.userMessage);

      return rejectWithValue(error.userMessage);
    }
  }
);

export const clearWatchHistory = createAsyncThunk(
  "user/clearWatchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/users/history");
      toast.success(
        response.data.data.message || "Watch history cleared successfully."
      );
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO FETCHED WATCHHISTORY", error.userMessage);
      toast.error(error.userMessage || "Failed to fetch watchHistory.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const addLink = createAsyncThunk(
  "user/addLink",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/about/user/add/link`,
        formData
      );
      toast.success(response.data.data.message || "Link added successfully.");
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO ADDED LINK", error.userMessage);
      toast.error(error.userMessage || "Failed to added link.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updateLink = createAsyncThunk(
  "user/updateLink",
  async ({ linkId, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/about/user/u/link/${linkId}`,
        formData
      );
      toast.success(response.data.data.message || "Link updated successfully.");
    } catch (error) {
      console.log("FAILED TO UPDATE LINK", error.userMessage);
      toast.error(error.userMessage || "Failed to update link.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const removeLink = createAsyncThunk(
  "user/removeLink",
  async ({ linkId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/about/user/remove/link/${linkId}`
      );
      toast.success(response.data.data.message || "Link removed successfully.");
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO REMOVE LINK", error.userMessage);
      toast.error(error.userMessage || "Failed to remove link.");
      return rejectWithValue(error.userMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userData = null;
      });

    // LOGOUT
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      });

    // GET CURRENT USER (Token Check)
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userData = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userData = null;
      });

    // → Sirf loading handle karo, userData ko touch mat karo!
    const safeCases = [
      verifyPassword,
      changePassword,
      sendOTP,
      verifyOTP,
      resetPassword,
      updateProfile,
      updateAvatar,
      updateCoverImage,
      watchHistory,
      clearWatchHistory,
      addLink,
      updateLink,
      removeLink,
    ];

    safeCases.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          // Agar payload mein updated user hai → merge karo
          if (action.payload && typeof action.payload === "object") {
            state.userData = { ...state.userData, ...action.payload };
          }
        })
        .addCase(thunk.rejected, (state) => {
          state.loading = false;
        });
    });
  },
});

export default authSlice.reducer;

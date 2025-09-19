import { axiosInstance } from "@/API/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userData: {},
  loading: false,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Login successful! 🎉");
      return response.data;
    } catch (error) {
      console.log("Login failed:", error.userMessage);
      toast.error(error.userMessage || "Login failed! ❌");
      return rejectWithValue(error.userMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userData = null;
      state.error = action.payload;
    });
  },
});

export default authSlice.reducer;

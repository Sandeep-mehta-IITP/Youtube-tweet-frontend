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

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      //console.log("Payload in slice:", action.payload);
      state.loading = false;
      state.userData = action.payload;
      state.isAuthenticated = true;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userData = null;
      state.error = action.payload;
    });

    // logout user
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userData = null;
    });

    builder.addCase(logoutUser.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });

    // Fetch current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    })

    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userData = action.payload;
    })

    builder.addCase(getCurrentUser.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userData = null;
    })
  },
});

export default authSlice.reducer;

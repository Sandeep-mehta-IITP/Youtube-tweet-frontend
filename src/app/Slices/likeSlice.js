import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "@/API/axiosInstance";

const initialState = {
  loading: false,
  status: false,
  data: null,
};

export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async ({ qs, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `like?toggleLike=${toggleLike}&${qs}`
      );
      return response.data;
    } catch (error) {
      console.log("FAILED TO TOGGLE LIKE", error.userMessage);
      toast.error(error.userMessage || "Failed to toggle like.");
      return rejectWithValue(error.userMessage);
    }
  }
);

const likeSlice = createSlice({
  name: "Like",
  initialState,
  extraReducers: (builder) => {
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
  },
});


export default likeSlice.reducer

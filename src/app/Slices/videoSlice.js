import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
  data: null,
  loading: false,
  status: false,
};


const videoSlice = createSlice({
  name: "Video",
  initialState,
  reducers: {
    emptyVideoState: (state, action) => {
      console.log("State.data:", state.data);
      state.data = null;
      console.log("State.data:", state.data);
    },
  },
});

export const { emptyVideoState } = videoSlice.actions;
export default videoSlice.reducer;

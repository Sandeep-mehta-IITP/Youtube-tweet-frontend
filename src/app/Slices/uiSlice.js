import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    asideOpen: true,
  },
  reducers: {
    toggleAside: (state) => {
      state.asideOpen = !state.asideOpen;
    },
    openAside: (state) => {
      state.asideOpen = true;
    },
    closeAside: (state) => {
      state.asideOpen = false;
    },
  },
});

export const { toggleAside, openAside, closeAside } = uiSlice.actions;
export default uiSlice.reducer;

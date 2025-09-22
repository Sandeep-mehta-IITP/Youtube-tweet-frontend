import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/API/axiosInstance";
import { toast } from "react-toastify";


const initialState = {
    loading: false,
    status: false,
    data: {videos: [], pagingInfo: {}}
}
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/API/axiosInstance";
import { toast } from "react-toastify";

const initialState = {
    loading: false,
    status: false
}

export const healthCheck = createAsyncThunk("/health/healthCheck", async (_, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.get("/healthcheck")
        console.log("Health check :", response.data)
        console.log("Health check :", response.data.data)
        return response.data
    } catch (error) {
        console.log("HEALTHCHEKC ERROR", error.userMessage);
        toast.error("OOPS! OUR SERVER IS SICK 🤒, Please try again later.")
        return rejectWithValue(error.userMessage)
    }
})

const healthCheckSlice = createSlice({
    name: "healthCheck",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(healthCheck.pending, (state) => {
            state.loading = true;
            state.status = false;
        })

        builder.addCase(healthCheck.fulfilled, (state) => {
            state.loading = false;
            state.status = true;
        })

        builder.addCase(healthCheck.rejected, (state) => {
            state.loading = false;
            state.status = false;
        })
    }
})


export default healthCheckSlice.reducer
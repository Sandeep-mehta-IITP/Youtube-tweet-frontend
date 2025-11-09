import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  data: null,
  loading: false,
  status: false,
};

export const publishVideo = createAsyncThunk(
  "video/publishVideo",
  async ({ data, signal }, { rejectWithValue }) => {
    try {
      // const formData = new FormData();

      // for (const key in data) formData.append(key, data[key]);
      // formData.append("thumbnail", data.thumbnail[0]);
      // formData.append("videoFile", data.videoFile[0]);

      const response = await axiosInstance.post("/videos/", data, {
        signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.error("Video publish cancelled");
        return rejectWithValue("Cancelled by user");
      }

      console.log("FAILED TO PUBLSIH VIDEO", error);
      toast.error(error.userMessage || "Failed to publsih video.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async ({ videoId, data }, { rejectWithValue }) => {
    //console.log("data", data);

    try {
      // const formData = new FormData();
      // for (const key in data) formData.append(key, data[key]);
      // if (data.thumbnail) formData.append("thumbnail", data.thumbnail[0]);

      // console.log("formData", formData);

      const response = await axiosInstance.patch(`/videos/${videoId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      console.log("FAILED TO UPDATE VIDEO", error.userMessage);
      toast.error(error.userMessage || "Failed to update video.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/videos/${videoId}`);
      toast.success(response.data.message || "Video deleted Successfully.");
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO DELETE VIDEO", error.userMessage);
      toast.error(error.userMessage || "Failed to delete video.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  "video/togglePublishStatus",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/videos/toggle/publish/${videoId}`
      );
      toast.success(
        response.data.message || "Toggle publish video successfully."
      );
      return response.data.data;
    } catch (error) {
      console.log("FAILED TO TOGGLE PUBLSIH STATUS", error.userMessage);
      toast.error(error.userMessage || "Failed to toggle publish status.");
      return rejectWithValue(error.userMessage);
    }
  }
);

// export const getVideo = createAsyncThunk(
//   "video/getVideo",
//   async (videoId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/videos/${videoId}`);
//       return response.data.data;
//     } catch (error) {
//       console.log("FAILED TO FETCHED VIDEO", error.userMessage);
//       toast.error(error.userMessage || "Failed to fetched video.");
//       return rejectWithValue(error.userMessage);
//     }
//   }
// );

// export const getAllVideos = createAsyncThunk(
//   "video/getAllVideos",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/videos?userId=${userId}`);
//       return response.data.data;
//     } catch (error) {
//       console.log("FAILED TO FETCHED ALL VIDEOS", error.userMessage);
//       toast.error(error.userMessage || "Failed to fetched all videos.");
//       return rejectWithValue(error.userMessage);
//     }
//   }
// );

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    emptyVideoState: (state, action) => {
      console.log("State.data:", state.data);
      state.data = null;
      console.log("State.data:", state.data);
    },
  },
  extraReducers: (builder) => {
    // Publish video
    builder.addCase(publishVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(publishVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(publishVideo.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // update video
    builder.addCase(updateVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(updateVideo.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // delete video
    builder.addCase(deleteVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(deleteVideo.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle publish status
    builder.addCase(togglePublishStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(togglePublishStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(togglePublishStatus.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export const { emptyVideoState } = videoSlice.actions;
export default videoSlice.reducer;

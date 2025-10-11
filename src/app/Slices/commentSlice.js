import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: null,
};

export const getVideoComments = createAsyncThunk(
  "comment/getVideoComments",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/comments/get/${videoId}`);
      return response.data;
    } catch (error) {
      console.log("FAILED TO FETCHED VIDEO COMMENTS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetched video comments.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/comments/add/${videoId}`, {
        content,
      });
      toast.success(response.data.message || "Comment added successfully.")
      return response.data;
    } catch (error) {
      console.log("FAILED TO ADD COMMENT ON VIDEO", error.userMessage);
      toast.error(error.userMessage || "Failed to add comment on video.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/comments/c/${commentId}`, {
        content,
      });
      toast.success(
        response?.data?.data?.message || "Update comment successfully !!!"
      );
      return response.data;
    } catch (error) {
      console.log("FAILED TO UPDATE COMMENT", error.userMessage);
      toast.error(error.userMessage || "Failed to update comment.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/comments/c/${commentId}`);
      toast.success(
        response?.data?.data?.message || "Comment deleted successfully !!!"
      );
      return response.data;
    } catch (error) {
      console.log("FAILED TO DELETE COMMENT", error.userMessage);
      toast.error(error.userMessage || "Failed to delete comment.");
      return rejectWithValue(error.userMessage);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  extraReducers: (builder) => {
    // get video comments
    builder.addCase(getVideoComments.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getVideoComments.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(getVideoComments.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // add comment on a video
    builder.addCase(addComment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addComment.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(addComment.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // update comment
    builder.addCase(updateComment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateComment.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(updateComment.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // delete comment
    builder.addCase(deleteComment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.data = action.payload;
    });

    builder.addCase(deleteComment.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export default commentSlice.reducer;

import { axiosInstance } from "@/API/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  data: null,
  loading: false,
  status: false,
};

export const getPlaylistByID = createAsyncThunk(
  "playlist/getPlaylistByID",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      //console.log("response", response.data?.data);

      return response.data;
    } catch (error) {
      console.log("FAILED TO FETCHED PLAYLIST", error.userMessage);

      toast.error(error.userMessage || "Failed to fetch playlist by ID.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getUserPlaylists = createAsyncThunk(
  "playlist/getUserPlaylists",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/playlist/user/${userId}`);
     // console.log("user playlists", response.data);
      return response.data?.data;
    } catch (error) {
      console.log("FAILED TO FETCHED USER PLAYLISTS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetch user playlists.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const getCurrentPlaylists = createAsyncThunk(
  "playlist/getCurrentPlaylists",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/playlist/user/playlists/${videoId}`
      );
     // console.log("current playlist ", response.data);

      return response.data;
    } catch (error) {
      console.log("FAILED TO FETCHED CURRENT PLAYLISTS", error.userMessage);
      toast.error(error.userMessage || "Failed to fetch current playlists.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/playlist", data);
      //console.log("create playlist response", response.data);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log("FAILED TO CREATE PLAYLIST", error.userMessage);
      toast.error(error.userMessage || "Failed to create playlist.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/add/${videoId}/${playlistId}`
      );
      //console.log("video add to playlist response", response.data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log("FAILED TO ADD VIDEO TO PLAYLIST", error.userMessage);
      toast.error(error.userMessage || "Failed to add video to playlist.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/remove/${videoId}/${playlistId}`
      );
      //console.log("video remove from playlist", response.data);

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log("FAILED TO REMOVE VIDEO FROM PLAYLIST", error.userMessage);
      toast.error(error.userMessage || "Failed to remove video from playlist.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlist/updatePlaylist",
  async ({ playlistId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/${playlistId}`,
        data
      );
      //console.log("update playlist response", response.data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log("FAILED TO UPDATE PLAYLIST", error.userMessage);
      toast.error(error.userMessage || "Failed to update playlist.");
      return rejectWithValue(error.userMessage);
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/playlist/${playlistId}`);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log("FAILED TO DELETE PLAYLIST", error.userMessage);
      toast.error(error.userMessage || "Failed to delete playlist.");
      return rejectWithValue(error.userMessage);
    }
  }
);

// const playlistSlice = createSlice({
//   reducerPath: "playlist",
//   initialState,
//   extraReducers: (builder) => {
//     // get playlist by ID

//     builder.addCase(getPlaylistByID.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(getPlaylistByID.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(getPlaylistByID.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });

//     // user playlists
//     builder.addCase(getUserPlaylists.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(getUserPlaylists.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(getUserPlaylists.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });

//     // current playlists
//     builder.addCase(getCurrentPlaylists.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(getCurrentPlaylists.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(getCurrentPlaylists.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });

//     // create playlist
//     builder.addCase(createPlaylist.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(createPlaylist.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(createPlaylist.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });

//     // add video to playlist
//     builder.addCase(addVideoToPlaylist.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(addVideoToPlaylist.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(addVideoToPlaylist.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });

//     // remove video from playlist
//     builder.addCase(removeVideoFromPlaylist.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(removeVideoFromPlaylist.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });

//     // update playlist
//     builder.addCase(updatePlaylist.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(updatePlaylist.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(updatePlaylist.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });

//     // delete playlist
//     builder.addCase(deletePlaylist.pending, (state) => {
//       ((state.loading = true),
//         (state.data = null),
//         (state.status = false));
//     });

//     builder.addCase(deletePlaylist.fulfilled, (state, action) => {
//       ((state.loading = false),
//         (state.data = action.payload),
//         (state.status = true));
//     });

//     builder.addCase(deletePlaylist.rejected, (state) => {
//       ((state.loading = false), (state.status = false));
//     });
//   },
// });

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    clearPlaylistState: (state) => {
      ((state.loading = false), (state.data = null), (state.status = false));
    },
  },
  extraReducers: (builder) => {
    // handle all pending actions
    builder.addMatcher(
      (action) =>
        action.type.startsWith("playlist/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = false;
        state.status = false;
      }
    );

    // handle all fulfilled actions
    builder.addMatcher(
      (action) =>
        action.type.startsWith("playlist/") &&
        action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = true;
      }
    );

    // handle all rejected actions
    builder.addMatcher(
      (action) =>
        action.type.startsWith("playlist/") &&
        action.type.endsWith("/rejected"),
      (state) => {
        state.loading = false;
        state.data = null;
        state.status = false;
      }
    );
  },
});

export default playlistSlice.reducer;

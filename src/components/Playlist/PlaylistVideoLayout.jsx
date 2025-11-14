import {
  addVideoToPlaylist,
  getPlaylistByID,
  removeVideoFromPlaylist,
} from "@/app/Slices/playlistSlice";
import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { Play, RotateCcw, Trash2, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const PlaylistVideoLayout = ({
  video,
  playlistId,
  owner = false,
  className = "",
}) => {
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // const buttonClickHandler =async () => {
  //   if (isDeleted) {
  //     await dispatch(addVideoToPlaylist({ videoId: video?._id, playlistId })).then(
  //       (res) => {
  //         if (res.meta.requestStatus === "fulfilled") {
  //           dispatch(getPlaylistByID(playlistId));
  //           setIsDeleted(false);
  //         }
  //       }
  //     );
  //   } else {
  //     await dispatch(
  //       removeVideoFromPlaylist({ videoId: video?._id, playlistId })
  //     ).then((res) => {
  //       if (res.meta.requestStatus === "fulfilled") {
  //          dispatch(getPlaylistByID(playlistId));
  //         setIsDeleted(true);
  //       }
  //     });
  //   }
  // };


  const buttonClickHandler = async () => {
  if (!isDeleted) {
    // UI FIRST
    setIsDeleted(true);

    // Backend SECOND
    dispatch(removeVideoFromPlaylist({ videoId: video?._id, playlistId }))
      .then(() => dispatch(getPlaylistByID(playlistId)))
      .catch(() => setIsDeleted(false)); // rollback on error
  } else {
    // UI FIRST
    setIsDeleted(false);

    // Backend SECOND
    dispatch(addVideoToPlaylist({ videoId: video?._id, playlistId }))
      .then(() => dispatch(getPlaylistByID(playlistId)))
      .catch(() => setIsDeleted(true)); // rollback on error
  }
};


  console.log("Owner is playlist video layout", owner);
  

  return (
    <div
      className={`group relative sm:h-52 flex gap-3 p-3 rounded-xl bg-gray-900/50 hover:bg-gray-800/80 transition-all duration-300 border border-transparent hover:border-gray-700 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Thumbnail */}
      <div className="relative shrink-0 w-40 sm:w-52 md:w-80 aspect-video rounded-lg overflow-hidden bg-gray-800">
        <Link to={`/watch/${video._id}`} className="block w-full h-full">
          <img
            src={video?.thumbnail?.url}
            alt={video?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Duration Badge */}
          <span className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium">
            {formatVideoDuration(video?.duration)}
          </span>

          {/* Play Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
            <div className="bg-white/90 p-2 rounded-full shadow-lg">
              <Play className="w-5 h-5 fill-black text-black" />
            </div>
          </div>
        </Link>
      </div>

      {/* Video Details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
          <Link to={`/watch/${video._id}`} className="hover:underline">
            {video?.title}
          </Link>
        </h3>

        {/* Views & Date */}
        <p className="text-xs sm:text-sm text-gray-400">
          {video?.views} view{video.views !== 1 ? "s" : ""} •{" "}
          {formatTimestamp(video?.createdAt)}
        </p>

        {/* Owner Info */}
        <div className="flex items-center gap-2">
          <Link to={`/user/${video?.owner?.username}`} className="shrink-0">
            <img
              src={video?.owner?.avatar}
              alt={video?.owner?.username}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-transparent hover:ring-blue-500 transition-all duration-200"
            />
          </Link>
          <Link
            to={`/user/${video?.owner?.username}`}
            className="text-sm text-gray-300 hover:text-blue-400 transition-colors truncate"
          >
            @{video?.owner?.username}
          </Link>
        </div>

        {/* Optional: Video Description (if available) */}
        {video?.description && (
          <p className="text-xs text-gray-400 line-clamp-1 mt-1">
            {video.description}
          </p>
        )}
      </div>

      {/* Action Buttons (Owner Only) */}
      {owner && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={buttonClickHandler}
            className={`p-2 rounded-full transition-all duration-200 ${
              isDeleted
                ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/40"
                : "bg-red-600/20 text-red-400 hover:bg-red-600/40"
            }`}
            title={isDeleted ? "Undo remove" : "Remove from playlist"}
          >
            {isDeleted ? (
              <RotateCcw className="w-4 h-4" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>

          {/* Optional: More Options */}
          <button className="p-2 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/70 hover:text-white transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Undo State Visual Feedback */}
      {isDeleted && (
        <div className="absolute inset-0 bg-red-900/20 rounded-xl flex items-center justify-center pointer-events-none">
          <p className="text-red-400 text-sm font-medium bg-red-900/80 px-3 py-1 rounded-full">
            Removed (click to undo)
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaylistVideoLayout;

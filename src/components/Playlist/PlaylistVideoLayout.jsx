import {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "@/app/Slices/playlistSlice";
import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { RotateCcw, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const PlaylistVideoLayout = ({ video, playlistId, owner = false }) => {
  const dispatch = useDispatch();

  const [isDeleted, setIsDeleted] = useState(false);

  const buttonClickHandler = () => {
    if (isDeleted) {
      dispatch(addVideoToPlaylist({ videoId: video?._id, playlistId })).then(
        (res) => {
          if (res.meta.requestStatus === "fulfilled") {
            setIsDeleted(false);
          }
        }
      );
    } else {
      dispatch(
        removeVideoFromPlaylist({ videoId: video?._id, playlistId })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setIsDeleted(true);
        }
      });
    }
  };
  return (
    <li key={video?._id} className="border">
      <div className="w-full sm:flex gap-x-4">
        {/* Video Thumbnail */}
        <div className="relative mb-2 w-full sm:w-5/12 sm:mb-0">
          <Link to={`/watch/${video._id}`}>
            <div className="w-full pt-[56%]">
              <div className="absolute inset-0">
                <img
                  src={video?.thumbnail}
                  alt={video?.title}
                  className="h-full w-full"
                />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium border border-white/20 min-w-[40px] text-center">
                {formatVideoDuration(video?.duration)}
              </span>
            </div>
          </Link>
        </div>

        {/* Video Data */}
        <div className="flex relative gap-x-2 px-2 sm:w-7/12 sm:px-0">
          <div className="w-10 h-10 shrink-0 sm:hidden">
            <img
              src={video.owner?.avatar}
              alt={video.owner?.fullName}
              className="h-full w-full rounded-full"
            />
          </div>

          {/* Video Deatisl */}
          <div className="w-full mt-2">
            {/* Title */}
            <h5 className="mb-1.5 text-xl text-[#f6f5f6] font-semibold sm:max-w-[75%]">
              {video?.title}
            </h5>

            {/* views and date */}
            <p className="text-sm flex text-gray-200 font-medium sm:mt-3">
              {video?.views} View{video.views > 1 ? "s" : ""} ·{" "}
              {formatTimestamp(video?.createdAt)}
            </p>

            {/* OwnerDetails */}
            <div className="flex items-center gap-x-3">
              <div className="w-10 h-10 mt-2 shrink-0 hidden sm:block">
                <Link to={`/user/${video?.owner?.username}`}>
                  <img
                    src={video?.owner?.avatar}
                    alt={video?.owner?.username}
                    className="w-full h-full rounded-full"
                  />
                </Link>
              </div>
              <p className="text-sm text-white/70 font-medium">
                <Link
                  to={`/user/${video?.owner?.username}`}
                  className="hover:text-sky-500 transition-colors duration-200"
                >
                  {video?.owner?.username}
                </Link>
              </p>
            </div>
          </div>

          {/* Delete Button */}
          {owner && (
            <span className="absolute top-2 right-2">
              {!isDeleted ? (
                // Remove button
                <button
                  onClick={buttonClickHandler}
                  title="Remove video"
                  className="inline-flex h-5 w-5 items-center justify-center text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                // Undo button
                <button
                  onClick={buttonClickHandler}
                  title="Undo changes"
                  className="inline-flex h-5 w-5 items-center justify-center text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default PlaylistVideoLayout;

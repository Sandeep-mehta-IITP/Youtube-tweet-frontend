import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { Loader, MoreHorizontal } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import NoVIdeoFound from "./NoVIdeoFound";

const VideoGrid = ({ videos = [], loading = false, fetching = false }) => {
  //console.log("videos received in VideoGrid:", videos);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            {/* Thumbnail skeleton - Fixed aspect ratio */}
            <div className="w-full h-48 bg-gray-800 rounded-lg relative overflow-hidden"></div>

            {/* Video info skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 p-4">
      {videos.map((video) => (
        <article
          key={video?._id}
          className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-200"
        >
          {/* Thumbnail Container - Fixed height for consistency */}
          <div className="relative overflow-hidden">
            <Link to={`/watch/${video?._id}`}>
              <div className="w-full h-48 relative">
                {" "}
                {/* Fixed height like YouTube */}
                <img
                  src={video?.thumbnail?.url || video?.thumbnail}
                  alt={video?.title}
                  className="absolute inset-0 w-full h-full object-contain object-center bg-black rounded-t-lg transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </Link>

            {/* Duration Badge - Better positioning */}
            <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium border border-white/20 min-w-[40px] text-center">
              {formatVideoDuration(video?.duration)}
            </span>

            {/* Hover overlay for better UX */}

            <div className="absolute inset-0 bg-black bg-opacity-65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
          </div>

          {/* Video Info Card */}
          <div className="p-4 space-y-2">
            {/* Channel Avatar & Title */}
            <div className="flex items-start gap-3">
              <Link
                to={`/user/${video?.ownerDetails?.username}`}
                className="flex-shrink-0"
              >
                <img
                  src={video?.ownerDetails?.avatar}
                  alt={video?.ownerDetails?.username}
                  className="w-10 h-10 rounded-full border-2 border-white/20 object-cover ring-1 ring-white/10"
                  loading="lazy"
                />
              </Link>

              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Video Title */}
                <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-white transition-colors duration-200">
                  <Link
                    to={`/watch/${video?._id}`}
                    className="block hover:text-white/90 transition-colors duration-200"
                    title={video?.title}
                  >
                    {video?.title}
                  </Link>
                </h3>

                {/* Channel Name */}
                <p className="text-xs text-white/70 font-medium">
                  <Link
                    to={`/user/${video?.ownerDetails?.username}`}
                    className="hover:text-sky-500 transition-colors duration-200"
                    title={video?.ownerDetails?.username}
                  >
                    {video?.ownerDetails?.username}
                  </Link>
                </p>

                {/* Views & Time */}
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span>{video?.views?.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{formatTimestamp(video?.createdAt)}</span>
                </div>
              </div>

              {/* More Options */}
              <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      ))}

      {/* Load More Indicator */}
      {fetching && (
        <div className="col-span-full flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-sm text-white/60">
              Loading more videos...
            </span>
          </div>
        </div>
      )}

      {/* No Videos Message */}
      {!loading && !fetching && videos.length === 0 && (
        <NoVIdeoFound />
      )}
    </div>
  );
};

export default VideoGrid;

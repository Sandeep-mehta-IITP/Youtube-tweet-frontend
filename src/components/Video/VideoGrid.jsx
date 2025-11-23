import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { Loader } from "lucide-react"; 
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoVIdeoFound from "./NoVIdeoFound";

const VideoGrid = ({
  videos = [],
  loading = false,
  fetching = false,
  lastVideoRef,
  hasMore = true, 
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!loading) setHasLoaded(true);
  }, [loading]);

  // 🔥 Shimmer Component 
  const ShimmerCard = ({ index }) => (
    <div className="group bg-white/5 rounded-lg overflow-hidden animate-pulse">
      <div className="relative overflow-hidden">
        <div className="w-full aspect-video bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-t-lg"></div>
        <span className="absolute bottom-2 right-2 bg-black/80 w-12 h-4 rounded-md"></span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 p-4">
        {[...Array(12)].map((_, i) => (
          <ShimmerCard key={i} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 p-4">
      {videos.map((video, index) => {
        const isLast = index === videos.length - 1;
        return (
          <article
            key={video?._id}
            ref={isLast ? lastVideoRef : null}
            className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 opacity-0 animate-fadeIn" // 🔥 Fade-in animation
            style={{ animationDelay: `${index * 0.05}s` }} 
          >
            <div className="relative overflow-hidden">
              <Link to={`/watch/${video?._id}`}>
                <div className="w-full aspect-video relative">
                  <img
                    src={video?.thumbnail?.url || video?.thumbnail}
                    alt={video?.title}
                    className="absolute inset-0 w-full h-full object-cover bg-black rounded-t-lg"
                    loading="lazy"
                  />
                </div>
              </Link>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                {formatVideoDuration(video?.duration)}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Link to={`/user/${video?.ownerDetails?.username}`} className="flex-shrink-0">
                  <img
                    src={video?.ownerDetails?.avatar}
                    alt={video?.ownerDetails?.username}
                    className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                    loading="lazy"
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                    <Link to={`/watch/${video?._id}`}>{video?.title}</Link>
                  </h3>
                  <p className="text-xs text-white/70">
                    <Link to={`/user/${video?.ownerDetails?.username}`}>
                      {video?.ownerDetails?.username}
                    </Link>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>{video?.views?.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{formatTimestamp(video?.createdAt)}</span>
                  </div>
                </div>

                <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15a5 5 0 100-10 5 5 0 000 10z"></path>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.5a1 1 0 102 0V5zM9.5 8.5a.5.5 0 000 1H9v3.5a.5.5 0 00.5.5h1a.5.5 0 000-1V9h.5a.5.5 0 000-1h-1V8.5z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {/*  Enhanced Loader */}
      {fetching && (
        <div className="col-span-full flex justify-center items-center py-8">
          <Loader className="w-6 h-6 animate-spin text-white/70 mr-2" />
          <span className="text-white/70 text-sm">Loading more videos...</span>
        </div>
      )}

      {/*  End of List Message  */}
      {!fetching && !hasMore && videos.length > 0 && (
        <div className="col-span-full flex justify-center items-center py-8 text-white/50 text-sm">
          You've seen it all! 😊 Check back later for more.
        </div>
      )}

      {hasLoaded && !loading && !fetching && videos.length === 0 && <NoVIdeoFound />}
    </div>
  );
};


export default VideoGrid;
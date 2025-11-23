import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { Loader, MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoVIdeoFound from "./NoVIdeoFound";

const VideoGrid = ({ videos = [], loading = false, fetching = false, lastVideoRef }) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!loading) setHasLoaded(true);
  }, [loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 p-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="w-full aspect-video bg-gray-800 rounded-lg"></div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 min-h-screen p-4">

      {videos.map((video, index) => {
        const isLast = index === videos.length - 1;

        return (
          <article
            key={video?._id}
            ref={isLast ? lastVideoRef : null}
            className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-200"
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
                <Link
                  to={`/user/${video?.ownerDetails?.username}`}
                  className="flex-shrink-0"
                >
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
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {fetching && (
        <div className="col-span-full flex justify-center items-center py-12">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      )}

      {hasLoaded && !loading && !fetching && videos.length === 0 && (
        <NoVIdeoFound />
      )}
    </div>
  );
};

export default VideoGrid;

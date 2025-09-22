import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { Loader } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const VideoGrid = ({ videos = [], loading = false, fetching = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit, minmax(250px,_1fr))] gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse rounded bg-slate-200">
            {/* Thumbnail skeleton*/}
            <div className="w-full pt-[56%] rounded relative bg-slate-300"></div>
            {/* Title skeleton*/}
            <div className="mt-2 w-3/4 h-4 bg-slate-300 rounded"></div>
            {/* Subtitle skeleton*/}
            <div className="mt-1 w-1/2 bg-slate-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // if (videos.length === 0) {
  //   return <p className="text-center text-sky-400 p-4">No videos found...</p>;
  // }
  
  return (
    <div className="grid grid-cols-[repeat(auto-fit, minmax(250px,_1fr))] gap-4 p-4">
      {videos.map((video) => (
        <div key={video?._id}>
          {/* Thumbani*/}
          <div className="w-full pt-[56%] relative">
            <Link to={`/watch/${video?._id}`}>
              <img
                src={video?.thumbnail}
                alt={video.title}
                className="absolute top-0 left-0 w-full h-full object-cover rounded"
              />
            </Link>
            <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1.5 rounded">
              {formatVideoDuration(video?.duration)}
            </span>
          </div>

          {/* Video Info */}
          <div className="flex mt-2 gap-2">
            <Link to={`/user/${video?.owner?.username}`}>
              <img
                src={video?.owner?.username}
                alt={video?.owner?.username}
                className="w-10 h-10 rounded-full"
              />
            </Link>

            <div>
              <h5 className="font-semibold text-sm">
                <Link to={`/watch/${video?._id}`}>{video?.title}</Link>
              </h5>

              <p className="text-gray-200 text-sm font-semibold">
                {video?.views} views | {formatTimestamp(video?.createdAt)}
              </p>

              <p className="text-sm text-gray-300 hover:text-sky-500">
                <Link to={`/user/${video.owner?.username}`}>
                  {video.owner?.name}
                </Link>
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Fetching Videos*/}

      {fetching && (
        <div className="col-span-full flex justify-center items-center mt-4">
          <Loader className="w-6 h-6 text-sky-400 animate-spin font-semibold" />
        </div>
      )}
    </div>
  );
};

export default VideoGrid;

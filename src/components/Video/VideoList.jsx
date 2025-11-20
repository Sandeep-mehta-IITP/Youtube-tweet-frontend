import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";

const VideoList = ({ videos = [], loading = true, fetching = false }) => {
  const navigate = useNavigate();

  console.log("videos in video list", videos);

  if (loading)
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex flex-col gap-6 p-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full max-w-3xl flex flex-col md:flex-row gap-4 rounded-xl bg-white/5 p-2 animate-pulse"
            >
              <div className="relative w-full md:w-5/12 aspect-video rounded-lg bg-slate-100/10"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 rounded bg-slate-100/10"></div>
                <div className="h-4 w-1/2 rounded bg-slate-100/10"></div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100/10"></div>
                  <div className="h-4 w-32 rounded bg-slate-100/10"></div>
                </div>
                <div className="h-4 w-5/6 rounded bg-slate-100/10"></div>
                <div className="h-4 w-2/3 rounded bg-slate-100/10"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <ul className="flex flex-col gap-6 p-4">
        {videos.map((video) => (
          <li
            key={video?._id}
            className="w-full max-w-4xl hover:bg-white/5 transition-colors rounded-xl p-2"
          >
            <Link
              to={`/watch/${video._id}`}
              className="flex flex-col md:flex-row gap-4"
            >
              {/* Thumbnail */}
              <div className="relative w-full md:w-5/12 aspect-video rounded-xl overflow-hidden">
                <img
                  src={video?.thumbnail?.url || video?.thumbnail}
                  alt={video?.title}
                  className="w-full h-full object-cover rounded-xl bg-black"
                  loading="lazy"
                />
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-md font-medium backdrop-blur-md shadow-lg border border-white/10">
                  {formatVideoDuration(video?.duration)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Title + Meta */}
                <div>
                  <h6 className="text-[#f6f5f6] font-semibold leading-tight line-clamp-2 hover:text-sky-400 transition-colors">
                    {video.title}
                  </h6>
                  <p className="flex items-center gap-2 text-xs text-white/50 mt-1">
                    <span>{video?.views?.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{formatTimestamp(video?.createdAt)}</span>
                  </p>
                </div>

                {/* Channel Info */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(
                        `/user/${video.owner?.username || video.ownerDetails?.username}`
                      );
                    }}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={video.owner?.avatar || video.ownerDetails?.avatar}
                      alt={
                        video.owner?.username || video.ownerDetails?.username
                      }
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <p className="text-sm text-gray-200 font-medium hover:text-sky-300 transition-colors">
                      {video.owner?.fullName || video.ownerDetails?.fullName}
                    </p>
                  </button>
                </div>

                {/* Description */}
                <p className="hidden md:block text-sm text-gray-400 mt-2 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </Link>
          </li>
        ))}

        {fetching && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-300">
            <Loader className="w-5 h-5 animate-spin text-sky-400" />
            <span className="animate-pulse">Please wait...</span>
          </div>
        )}
      </ul>
    </section>
  );
};

export default VideoList;

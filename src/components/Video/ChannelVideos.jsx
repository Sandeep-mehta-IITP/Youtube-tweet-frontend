import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import MyChannelEmptyVideos from "./MyChannelEmptyVideos";
import EmptyVideos from "./EmptyVideos";

import { useGetAllVideosQuery } from "@/features/auth/videoApi";
import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";

function ChannelVideos({ owner = false }) {
  const dispatch = useDispatch();
  const { username } = useParams();

  const { isAuthenticated, userData: currentUser } = useSelector(
    (state) => state.auth
  );
  const viewedUser = useSelector((state) => state.user.userData);
  const userId = owner ? currentUser?._id : viewedUser?._id;

  const {
    data: videosData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllVideosQuery(
    { userId },
    { skip: !userId } // Skip fetching until userId is available
  );

  // skeleton loading state
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-3 pt-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-full">
            <div className="relative mb-1 w-full pt-[56%]">
              <div className="absolute inset-0 bg-slate-100/10 rounded animate-pulse"></div>
            </div>
            <div className="mb-1 rounded bg-slate-100/10 animate-pulse h-8 w-full"></div>
            <div className="flex rounded text-gray-200 bg-slate-100/10 animate-pulse h-5 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // error state
  if (isError) {
    return (
      <div className="text-center text-red-400 py-6">
        <p>⚠️ Failed to load videos. Please try again later.</p>
        <button
          onClick={refetch}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const videos = videosData?.data?.docs || [];

  //   console.log("videos", videos);

  // empty state
  if (videos.length < 1) {
    return owner ? <MyChannelEmptyVideos /> : <EmptyVideos />;
  }

  return (
    <ul
      className={`grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] ${
        videos.length < 3 &&
        "lg:grid-cols-[repeat(auto-fit,_minmax(300px,0.25fr))]"
      } gap-4 pt-2`}
    >
      {videos.map((video) => (
        <li key={video?._id} className="w-full group">
          <Link to={`/watch/${video?._id}`}>
            {/* Thumbnail */}
            <div className="relative mb-2 w-full pt-[56%] overflow-hidden rounded-lg">
              <img
                src={video?.thumbnail?.url}
                alt={video?.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              {video?.duration && (
                <span className="absolute bottom-2 right-2 inline-block rounded bg-black/70 px-2 text-xs font-semibold">
                  {formatVideoDuration(video?.duration)}
                </span>
              )}
            </div>

            {/* Video Info */}
            <div className="flex items-start space-x-3">
              <img
                src={video?.ownerDetails?.avatar}
                alt={video?.ownerDetails?.fullName || "Avatar"}
                className="w-11 h-11 rounded-full object-cover"
              />
              <span className="ml-1.5">
                <h6 className="mb-1 font-semibold text-gray-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {video?.title || "Untitled Video"}
                </h6>
                <p className="text-sm text-gray-400">
                  {video?.views ?? 0} views ·{" "}
                  {formatTimestamp(video?.createdAt)}
                </p>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ChannelVideos;

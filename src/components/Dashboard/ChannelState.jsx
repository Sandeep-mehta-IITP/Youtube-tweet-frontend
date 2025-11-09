import React, { useRef } from "react";
import StatusLayout from "./StatusLayout";
import { Eye, ThumbsUp, Upload, Users2, VideoIcon } from "lucide-react";
import VideoUploadForm from "./VideoUploadForm";

const ChannelState = ({ channelStates = null }) => {
  const uploadRef = useRef();

  if (!ChannelState) {
    const cardSkeletons = Array.from({ length: 4 }); // create 4 skeleton cards

    return (
      <>
        {/* Header Section Skeleton */}
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          {/* Left Side: Channel Info */}
          <div className="space-y-2">
            <div className="w-64 h-6 rounded bg-gray-300/65 animate-pulse"></div>
            <div className="w-96 h-6 rounded bg-gray-300/65 animate-pulse"></div>
          </div>

          {/* Right Side: Upload Button */}
          <div className="w-36 h-12 rounded bg-gray-300/65 animate-pulse"></div>
        </div>

        {/* Video Card Skeletons */}
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6">
          {cardSkeletons.map((_, i) => (
            <div
              key={i}
              className="border border-gray-300/20 rounded-2xl bg-gray-200/10 animate-pulse p-4 shadow-sm"
            >
              <div className="mb-4 h-40 w-full rounded-lg bg-gray-300/40"></div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-gray-300/60 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-300/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  //console.log("channel states", channelStates);
  
  return (
    <>
      {/* Headers */}
      <div className="flex flex-wrap justify-between gap-4 ">
        {/* Welcoming Headers */}
        <div className="block">
          <h1 className="text-2xl font-bold">
            Welcome Back, <span className="text-sky-600">{channelStates?.ownerName}</span>
          </h1>
          <p className="text-sm text-gray-300">
            Seamless Video Management, Elevated Results.
          </p>
        </div>

        {/* Video Upload Button */}
        <div className="block">
          {<VideoUploadForm ref={uploadRef} />}
          <button
            onClick={() => uploadRef.current?.open()}
            className="inline-flex items-center gap-x-2 bg-blue-600 hover:bg-blue-700 
               border border-transparent hover:border-blue-300 
               text-white font-semibold rounded-xl 
               transition-all duration-200 px-4 py-2 shadow-sm"
          >
            <Upload className="w-6 h-6" />
            Upload Video
          </button>
        </div>
      </div>

      {/* Channel States Components */}
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
        {/* total videos */}
        <StatusLayout
          key="total-videos"
          title="Total Videos"
          value={channelStates.totalVideos}
          icon={<VideoIcon className="w-6 h-6 font-semibold" />}
        />

        {/* total views */}
        <StatusLayout
          key="total-views"
          title="Total views"
          value={channelStates.totalViews}
          icon={<Eye className="w-6 h-6 font-semibold" />}
        />

        {/* total subscribers */}
        <StatusLayout
          key="total-subscribers"
          title="Total subscribers"
          value={channelStates.totalSubscribers}
          icon={<Users2 className="w-6 h-6 font-semibold" />}
        />

        {/* total likes */}
        <StatusLayout
          key="total-likes"
          title="Total likes"
          value={channelStates.totalLikes}
          icon={<ThumbsUp className="w-6 h-6 font-semibold" />}
        />
      </div>
    </>
  );
};

export default ChannelState;

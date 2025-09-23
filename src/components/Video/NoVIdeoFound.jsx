import { VideoOff } from "lucide-react";
import React from "react";

const NoVideoFound = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
        <VideoOff className="w-16 h-16 text-red-700" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-4">
        No videos found
      </h3>
      <p className="text-lg text-white/80 max-w-md">
        Try searching for something else or check back later for new content.
      </p>
    </div>
  );
};

export default NoVideoFound;

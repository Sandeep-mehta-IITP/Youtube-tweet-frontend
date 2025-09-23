import { VideoOff } from "lucide-react";
import React from "react";

const NoVIdeoFound = () => {
    
  return (
    <div className="col-span-full flex flex-col  items-center justify-center py-28 text-center">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
        <VideoOff className="w-16 h-16 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">
        No videos found
      </h3>
      <p className="text-lg text-white/80 max-w-md">
        Try searching for something else or check back later for new content.
      </p>
    </div>
  );
};

export default NoVIdeoFound;

import { Play, Plus } from "lucide-react";
import React from "react";

const MyChannelEmptyPlaylist = ({ onClickBtn }) => {
  return (
    <section className="flex justify-between mt-2">
      <div className="w-full max-w-sm text-center">
        {/* Play icon */}
        <p className="w-full mb-4">
          <span className="inline-flex rounded-full bg-gray-800 p-2 text-[#f6f5f6] font-semibold">
            <Play className="w-6 h-6 " />
          </span>
        </p>

        <h5 className="mb-3 text-[#f6f5f6] font-semibold">
          No playlists created
        </h5>
        <p className="text-sm text-[#f6f5f6] font-medium">
          Your Channel has yet to create a playlist. <br /> create a playlist
          and add some videos.
        </p>

        {/* Add button */}
        <button
          onCanPlay={() => onClickBtn()}
          className="mt-5 inline-flex items-center gap-x-3 border border-transparent hover:border-dotted hover:border-white px-4 py-2 font-semibold bg-blue-400 text-[#121212]"
        >
          <Plus className="w-5 h-5" />
          Create New Playlist
        </button>
      </div>
    </section>
  );
};

export default MyChannelEmptyPlaylist;

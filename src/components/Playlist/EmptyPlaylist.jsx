import { FileVideo, ShoppingCart } from "lucide-react";
import React from "react";

const EmptyPlaylist = ({ playlistVideos = false }) => {
  return (
    <section className="flex min-h-[90vh] items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-gray-700/80 p-4 shadow-lg mb-5">
          <FileVideo className="w-12 h-12 text-[#f6f5f6]" />
        </div>

        <h5 className="mb-3 text-xl sm:text-3xl font-semibold text-[#f6f5f6]">
          {playlistVideos ? "Empty Playlist" : "No Playlists Created"}
        </h5>

        <p className="text-sm sm:text-xl text-gray-200 font-medium mb-4">
          {playlistVideos
            ? "This playlist doesn't have any videos yet."
            : "There are no playlists created on this channel."}
        </p>
      </div>
    </section>
  );
};

export default EmptyPlaylist;

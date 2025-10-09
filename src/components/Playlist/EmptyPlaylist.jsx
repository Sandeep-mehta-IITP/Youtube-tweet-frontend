import { ShoppingCart } from "lucide-react";
import React from "react";

const EmptyPlaylist = ({ playlistVideos = false }) => {
  return (
    <section className="flex justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <p className="w-full mb-4">
          <span className="inline-flex rounded-full bg-gray-800 p-2 text-[#f6f5f6] font-semibold">
            <ShoppingCart className="w-6 h-6" />
          </span>
        </p>

        <h5 className="mb-3 text-[#f6f5f6] font-semibold">
          {playlistVideos ? "Empty Playlist" : "No playlists created"}
        </h5>

        <p className="text-sm text-[#f6f5f6] font-medium">
          {playlistVideos
            ? "This Playlist has no Videos."
            : "There are no playlist created on this channel."}
        </p>
      </div>
    </section>
  );
};

export default EmptyPlaylist;

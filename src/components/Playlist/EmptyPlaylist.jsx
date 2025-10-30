import { FileVideo } from "lucide-react";
import React from "react";

const EmptyPlaylist = ({ playlistVideos = false }) => {
  return (
    <section className="flex min-h-[90vh] items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center mb-6 rounded-2xl bg-gray-800/70 p-5 shadow-md backdrop-blur-sm">
          <FileVideo className="w-14 h-14 text-sky-600" aria-hidden="true" />
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

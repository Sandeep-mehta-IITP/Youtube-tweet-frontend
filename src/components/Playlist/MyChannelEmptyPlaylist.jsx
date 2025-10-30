import React from "react";
import { motion } from "framer-motion";
import { Play, Plus } from "lucide-react";

const MyChannelEmptyPlaylist = ({ onClickBtn }) => {
  return (
    <section
      className="flex min-h-[65vh] items-center justify-center p-6"
      aria-label="Empty playlist section"
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Icon Container */}
        <div className="inline-flex items-center justify-center mb-6 rounded-2xl bg-gray-800/70 p-5 shadow-md backdrop-blur-sm">
          <Play className="w-14 h-14 text-sky-500" aria-hidden="true" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-3xl font-semibold text-gray-100 mb-3">
          No Playlists Created
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-6">
          You haven’t created any playlists yet. Start organizing your favorite{" "}
          <span className="font-medium text-blue-400">videos</span> and make
          your channel more engaging.
        </p>

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClickBtn}
          className="inline-flex items-center gap-x-3 rounded-lg border border-transparent bg-blue-500 px-5 py-2.5 font-semibold text-[#121212] hover:bg-blue-400 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Create New Playlist
        </motion.button>
      </motion.div>
    </section>
  );
};

export default MyChannelEmptyPlaylist;

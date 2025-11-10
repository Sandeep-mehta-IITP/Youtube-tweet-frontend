import React from "react";
import { motion } from "framer-motion";
import { VideoIcon } from "lucide-react";

const EmptyVideos = () => {
  return (
    <section
      className="flex min-h-[65vh] items-center justify-center p-6"
      aria-label="Empty videos section"
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <div className="inline-flex items-center justify-center mb-6 rounded-2xl bg-gray-800/70 p-5 shadow-md backdrop-blur-sm">
          <VideoIcon className="w-14 h-14 text-sky-600" aria-hidden="true" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-3xl font-semibold text-gray-100 mb-2">
          No Videos to Show
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
          This channel hasn’t uploaded any videos yet.{" "}
          <span className="font-medium text-red-500">Check</span> back soon for{" "}
          <span className="font-medium text-blue-400">new uploads</span> or
          explore other creators to discover fresh and exciting content.
        </p>
      </motion.div>
    </section>
  );
};

export default EmptyVideos;

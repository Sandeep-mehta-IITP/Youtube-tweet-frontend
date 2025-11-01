import React from "react";
import { motion } from "framer-motion";
import { VideoIcon } from "lucide-react";

const MyChannelEmptyVideos = () => {
  return (
    <section
      className="flex min-h-[55vh] items-center justify-center p-6"
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
          No Videos Uploaded Yet
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
          You haven’t uploaded any videos so far.{" "}
          <span className="font-medium text-blue-400">Start creating</span> and
          share your first video to engage with your audience and grow your
          channel.
        </p>
      </motion.div>
    </section>
  );
};

export default MyChannelEmptyVideos;

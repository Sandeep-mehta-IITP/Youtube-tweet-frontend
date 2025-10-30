import React from "react";
import { motion } from "framer-motion";
// import { MdSentimentDissatisfied } from "react-icons/md";
import { Users } from "lucide-react"

const MyChannelEmptySubscription = () => {
  return (
    <section
      className="flex min-h-[65vh] items-center justify-center p-6"
      aria-label="Empty tweet section"
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Icon Container */}
        <div className="inline-flex items-center justify-center mb-6 rounded-2xl bg-gray-800/70 p-5 shadow-md backdrop-blur-sm">
          <Users
            className="w-14 h-14 text-sky-600"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-3xl font-semibold text-gray-100 mb-2">
          No Subscribers Yet
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
          Your channel doesn’t have any subscribers yet. Keep{" "}
          <span className="font-medium text-blue-400">creating</span> and
          sharing engaging content to grow your audience and build your
          community.
        </p>
      </motion.div>
    </section>
  );
};

export default MyChannelEmptySubscription;

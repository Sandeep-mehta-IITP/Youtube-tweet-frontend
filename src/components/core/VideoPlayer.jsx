import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Initialize Video.js player
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return; // Ensure the video element exists

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("Player ready!!!");
        onReady && onReady(player);
      }));
    } else {
      // Update existing player
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
      player.poster(options.poster)
    }

    // Cleanup on unmount
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options]); // Ensure options is stable (e.g., memoized in parent)

  return (
    <div data-vjs-player className="size-full">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      />
    </div>
  );
};

export default VideoPlayer;
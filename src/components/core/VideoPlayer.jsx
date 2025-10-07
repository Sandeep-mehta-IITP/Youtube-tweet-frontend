import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // 1️⃣ Init once on mount / dispose on unmount
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!playerRef.current) {
      playerRef.current = videojs(videoElement, options, () => {
        videojs.log("Player ready!!!");
        onReady?.(playerRef.current);
      });
    }

    return () => {
      if (playerRef.current) {
        videojs.log("Player will dispose");
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []); // only run once

  // 2️⃣ Update existing player on options change
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src(options.sources);
      playerRef.current.poster(options.poster);
      playerRef.current.autoplay(options.autoplay);
    }
  }, [options]);

  return (
    <div data-vjs-player className="size-full">
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;

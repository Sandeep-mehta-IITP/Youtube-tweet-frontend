import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize player on mount, dispose on unmount
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!playerRef.current) {
      playerRef.current = videojs(
        videoElement,
        {
          ...options,
          controls: true,
          responsive: true,
          fluid: true,
          fill: false, // Prevent automatic full-screen
          playbackRates: [0.5, 1, 1.5, 2], // YouTube-like playback speed options
        },
        () => {
          videojs.log("Player ready!!!");
          setIsLoading(false);
          onReady?.(playerRef.current);
        }
      );

      // Handle errors
      playerRef.current.on("error", () => {
        console.error("Video.js Error:", playerRef.current.error());
        setIsError(true);
        setIsLoading(false);
        setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.src(options.sources);
            setIsError(false);
          }
        }, 2000);
      });

      // Clear loading state when video can play
      playerRef.current.on("canplay", () => {
        setIsLoading(false);
      });
    }

    return () => {
      if (playerRef.current) {
        videojs.log("Player will dispose");
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Update player when options change
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src(options.sources || []);
      playerRef.current.poster(options.poster || "/default-thumbnail.png");
      playerRef.current.autoplay(options.autoplay || false);
    }
  }, [options]);

  return (
    <div data-vjs-player className="relative w-full aspect-video">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
          role="status"
          aria-live="polite"
        >
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {isError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-xl"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-gray-900 dark:text-white">
            Failed to load video. Retrying...
          </p>
        </div>
      )}
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-youtube"
        style={{ objectFit: "cover" }}
        aria-label="Video player"
      />
    </div>
  );
};

export default VideoPlayer;

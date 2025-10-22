import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!videoRef.current || playerRef.current) return;

    const player = (playerRef.current = videojs(
      videoRef.current,
      {
        ...options,
        controls: true,
        responsive: true,
        fluid: true,
        fill: false,
        playbackRates: [0.5, 1, 1.5, 2],
      },
      () => {
        onReady?.(player);
      }
    ));

    player.on("error", () => {
      setIsError(true);
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.src(options.sources);
          playerRef.current.load();
          setIsError(false);
        }
      }, 2000);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  // Update source when options change
  useEffect(() => {
    if (playerRef.current && options.sources?.[0]?.src) {
      const currentSrc = playerRef.current.currentSrc();
      const newSrc = options.sources[0].src;
      if (currentSrc !== newSrc) {
        playerRef.current.src(options.sources);
        playerRef.current.poster(options.poster);
        playerRef.current.load();
      }
    }
  }, [options]);

  return (
    <div data-vjs-player className="relative w-full h-full">
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <p className="text-white text-sm">Retrying...</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-youtube"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;

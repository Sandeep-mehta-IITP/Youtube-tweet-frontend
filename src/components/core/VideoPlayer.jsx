import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const { options, onReady } = props;

  useEffect(() => {
    // Video.js player initilaized once
    if (!videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("Player ready!!!");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [videoRef, options]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    if (player && player.isDisposed()) {
      player.dispose();
      playerRef.current = null;
    }
  }, [playerRef]);

  return (
    <div data-vjs-player className="size-full">
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  SkipBack,
  SkipForward,
  Loader,
} from "lucide-react";

const CustomYouTubePlayer = ({ src, poster, title = "Video" }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const hideTimeoutRef = useRef(null);
  const dragRef = useRef({ seeking: false });
  const lastTapRef = useRef(0);

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // --- Helpers ---
  const formatTime = useCallback((t) => {
    if (!t && t !== 0) return "0:00";
    const hrs = Math.floor(t / 3600);
    const mins = Math.floor((t % 3600) / 60);
    const secs = Math.floor(t % 60);
    if (hrs > 0)
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // --- Play/Pause ---
  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);
  const pause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
  }, []);
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else pause();
  }, [play, pause]);

  // --- Seek ---
  const seekTo = useCallback((time) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(time, v.duration || 0));
    setCurrentTime(v.currentTime);
  }, []);

  // --- Hide controls logic ---
  const scheduleHideControls = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying && !isDragging) {
      hideTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
    }
  }, [isPlaying, isDragging]);

  const showControlsNow = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    scheduleHideControls();
  }, [scheduleHideControls]);

  // --- Volume ---
  const handleVolumeChange = useCallback((newVol) => {
    const v = videoRef.current;
    if (!v) return;
    newVol = Math.max(0, Math.min(1, newVol));
    v.volume = newVol;
    v.muted = newVol === 0;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    if (v.muted) setVolume(0);
    else setVolume(v.volume || 1);
  }, []);

  const handleVolumePointerDown = useCallback(
    (e) => {
      if (!volumeRef.current) return;
      setIsDragging(true);

      const rect = volumeRef.current.getBoundingClientRect();
      const x = e.clientX || e.touches?.[0]?.clientX || 0;
      const pos = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      handleVolumeChange(pos);

      const move = (ev) => {
        const mx = ev.clientX || ev.touches?.[0]?.clientX || 0;
        const p = Math.max(0, Math.min(1, (mx - rect.left) / rect.width));
        handleVolumeChange(p);
      };
      const up = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", move);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("mouseup", up);
        window.removeEventListener("touchend", up);
        scheduleHideControls();
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("touchmove", move, { passive: true });
      window.addEventListener("mouseup", up);
      window.addEventListener("touchend", up);
    },
    [handleVolumeChange, scheduleHideControls]
  );

  // --- Speed menu ---
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const changeSpeed = useCallback((r) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = r;
    setPlaybackRate(r);
    setShowSpeedMenu(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        if (isMobile && screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape");
        }
      } catch (e) {
        console.warn("Fullscreen request failed:", e);
      }
    } else {
      try {
        if (isMobile && screen.orientation && screen.orientation.unlock) {
          await screen.orientation.unlock();
        }
        await document.exitFullscreen();
      } catch (e) {
        console.warn("Exit fullscreen failed:", e);
      }
    }
  }, [isMobile]);

  // --- Click anywhere toggles play/pause but not when clicking controls ---
  const handleContainerClick = useCallback(
    (e) => {
      // if clicking on a control, ignore. Controls have data-player-control attribute
      const target = e.target;
      if (target && target.closest && target.closest("[data-player-control]"))
        return;

      const now = Date.now();
      const delta = now - lastTapRef.current;

      // double-tap: skip 10s forward/back based on position (left or right)
      if (delta < 250) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2)
          seekTo((videoRef.current?.currentTime || 0) - 10);
        else seekTo((videoRef.current?.currentTime || 0) + 10);
        lastTapRef.current = 0;
        return;
      }

      lastTapRef.current = now;

      // single click: toggle
      togglePlay();
    },
    [seekTo, togglePlay]
  );

  // --- Progress interactions ---
  const handleProgressPointerDown = useCallback(
    (e) => {
      if (!progressRef.current || !videoRef.current) return;
      dragRef.current.seeking = true;
      setIsDragging(true);

      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX || e.touches?.[0]?.clientX || 0;
      const pos = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      seekTo(pos * (videoRef.current.duration || 0));

      const move = (ev) => {
        const mx = ev.clientX || ev.touches?.[0]?.clientX || 0;
        const p = Math.max(0, Math.min(1, (mx - rect.left) / rect.width));
        seekTo(p * (videoRef.current.duration || 0));
      };
      const up = () => {
        dragRef.current.seeking = false;
        setIsDragging(false);
        window.removeEventListener("mousemove", move);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("mouseup", up);
        window.removeEventListener("touchend", up);
        scheduleHideControls();
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("touchmove", move, { passive: true });
      window.addEventListener("mouseup", up);
      window.addEventListener("touchend", up);
    },
    [seekTo, scheduleHideControls]
  );

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const onKey = (e) => {
      if (
        document.activeElement &&
        ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
      )
        return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo((videoRef.current?.currentTime || 0) - 10);
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo((videoRef.current?.currentTime || 0) + 10);
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyT":
          e.preventDefault();
          // toggleTheater(); // Assuming this is defined elsewhere
          break;
        case "KeyS":
          e.preventDefault();
          // cycle speeds
          const idx = speeds.indexOf(playbackRate);
          changeSpeed(speeds[(idx + 1) % speeds.length]);
          break;
        case "Escape":
          e.preventDefault();
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [
    togglePlay,
    seekTo,
    toggleMute,
    toggleFullscreen,
    playbackRate,
    changeSpeed,
    speeds,
    isFullscreen,
  ]);

  // --- Video event listeners ---
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(v.duration || 0);
      setIsBuffering(false);
    };
    const onTime = () => {
      if (!dragRef.current.seeking) setCurrentTime(v.currentTime);
      if (v.buffered && v.buffered.length) {
        const end = v.buffered.end(v.buffered.length - 1);
        setBufferedPercent(((end || 0) / (v.duration || 1)) * 100);
      }
    };
    const onPlay = () => {
      setIsPlaying(true);
      setShowControls(true);
      scheduleHideControls();
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onVolume = () => {
      setVolume(v.volume);
      setIsMuted(v.muted);
    };
    const onRate = () => setPlaybackRate(v.playbackRate);

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("volumechange", onVolume);
    v.addEventListener("ratechange", onRate);

    const onFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
    };
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("volumechange", onVolume);
      v.removeEventListener("ratechange", onRate);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [scheduleHideControls]);

  // cleanup hide timeout
  useEffect(
    () => () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    },
    []
  );

  // --- Initial volume and preload ---
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.preload = "metadata";
  }, []);

  // --- Volume icon ---
  const VolumeIcon = useCallback(() => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  }, [isMuted, volume]);

  // --- UI ---
  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group select-none z-50 transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 w-screen h-screen !aspect-auto z-[9999]"
          : "w-full max-w-full mx-auto md:top-0 md:left-1/2 md:-translate-x-1/2"
      } ${!isFullscreen ? "top-0" : ""}`}
      onMouseMove={showControlsNow}
      onClick={handleContainerClick}
      style={isFullscreen ? {} : { aspectRatio: "16/9" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        tabIndex={0}
      />

      {/* Buffering overlay */}
      {isBuffering && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60">
          <Loader className="w-8 h-8 md:w-10 md:h-10 animate-spin text-white" />
        </div>
      )}

      {/* Big center play button (clickable) */}
      {!isPlaying && (
        <button
          data-player-control
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-transform transform-gpu hover:scale-105">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-0.5" />
          </div>
        </button>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 z-40 pointer-events-none transition-opacity duration-200 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress bar area */}
        <div className="absolute bottom-16 md:bottom-20 left-2 md:left-3 right-2 md:right-3 pointer-events-auto">
          <div
            ref={progressRef}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleProgressPointerDown(e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleProgressPointerDown(e);
            }}
            className="h-1 md:h-1.5 rounded-full bg-white/20 relative cursor-pointer touch-manipulation"
            aria-label="progress bar"
          >
            {/* buffered */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/30"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* played */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-red-600"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
            {/* scrubber */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white shadow-lg"
              style={{
                left: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Bottom control bar */}
        <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2 md:p-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
              <div
                className="flex items-center gap-1 md:gap-2"
                data-player-control
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    seekTo((videoRef.current?.currentTime || 0) - 10);
                  }}
                  className="p-1.5 md:p-2 rounded-full hover:bg-white/10 flex-shrink-0"
                  title="Rewind 10s"
                >
                  <SkipBack className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="p-1.5 md:p-2 rounded-full hover:bg-white/10 flex-shrink-0"
                  title="Play/Pause"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    seekTo((videoRef.current?.currentTime || 0) + 10);
                  }}
                  className="p-1.5 md:p-2 rounded-full hover:bg-white/10 flex-shrink-0"
                  title="Forward 10s"
                >
                  <SkipForward className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>

                {/* Volume group aligned left */}
                <div
                  className="items-center gap-1 md:gap-2 ml-1 md:ml-2 hidden sm:flex" // Hide volume slider on very small screens (mobile), show on sm+ like YouTube (tap for volume panel, but since no logic change, hide to avoid cramping)
                  data-player-control
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="p-1.5 md:p-2 rounded hover:bg-white/10 flex-shrink-0"
                  >
                    <VolumeIcon />
                  </button>
                  <div
                    ref={volumeRef}
                    className="w-20 md:w-24 h-1 bg-white/30 rounded-full relative cursor-pointer group touch-manipulation flex-shrink-0"
                    onMouseDown={handleVolumePointerDown}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleVolumePointerDown(e);
                    }}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-red-600"
                      style={{ width: `${volume * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `${volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* time - truncate on mobile */}
              <div className="text-xs md:text-sm text-white/90 ml-1 md:ml-3 truncate flex-shrink">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div
              className="flex items-center gap-1 md:gap-2 flex-shrink-0"
              data-player-control
            >
              {/* Speed menu - position adjusted for mobile */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeedMenu((s) => !s);
                  }}
                  className="p-1.5 md:p-2 rounded hover:bg-white/10 flex-shrink-0"
                  title="Playback speed"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full mb-2 right-0 md:right-auto md:left-0 bg-black/95 rounded-md p-2 shadow-lg min-w-[100px] md:min-w-[110px] z-50">
                    <div className="text-xs text-white font-medium mb-2 px-1">
                      Playback speed
                    </div>
                    {speeds.map((s) => (
                      <button
                        key={s}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          changeSpeed(s);
                        }}
                        className={`w-full text-left px-2 py-1 text-xs rounded ${playbackRate === s ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                      >
                        {s === 1 ? "Normal" : `${s}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-1.5 md:p-2 rounded hover:bg-white/10 flex-shrink-0"
              >
                <Maximize2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomYouTubePlayer;

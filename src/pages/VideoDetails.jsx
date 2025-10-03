import {
  addVideoToPlaylist,
  createPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
} from "@/app/Slices/playlistSlice";
import { emptyVideoState } from "@/app/Slices/videoSlice";
import VideoPlayer from "@/components/core/VideoPlayer";
import { useGetVideoQuery } from "@/features/auth/videoApi";
import { formatTimestamp } from "@/utils/helpers/formatFigure";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import videojs from "video.js";

const VideoDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const loginPopupRef = useRef();
  const playerRef = useRef(null);

  const { isAuthenticated } = useSelector(({ auth }) => auth);

  const {
    loading: playlistLoading,
    status: playlistStatus,
    data: playlists,
  } = useSelector((state) => state.playlist);

  const { data: video, isLoading, error } = useGetVideoQuery(videoId);

  console.log("video", video);

  useEffect(() => {
    if (!videoId) return;
    return () => dispatch(emptyVideoState());
  }, [videoId, navigate]);

  // add and remove video from playlist
  const handlePlaylistVideo = (playlistId, videoId) => {
    if (!playlistId) return;

    if (status) {
      dispatch(addVideoToPlaylist({ videoId, playlistId }));
    } else {
      dispatch(removeVideoFromPlaylist({ videoId, playlistId }));
    }
  };

  // new playlist creation
  const createNewPlaylist = (eventObj) => {
    eventObj.preventDefault();

    const name = eventObj.target.name.value;

    // empty string check
    if (!name.trim()) {
      return toast.error("Please enter the playlist name.");
    }

    dispatch(createPlaylist({ data: { name } })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(addVideoToPlaylist({ playlistId: res.payload?._id, videoId }));
      }
    });
  };

  // if user logged in fetch all playlists otherwise show loginpopup
  const handleSavePlaylist = () => {
    if (isAuthenticated) {
      dispatch(getUserPlaylists(user._id));
    } else {
      loginPopupRef.current.open();
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Main video skeleton */}
        <div className="lg:col-span-2 animate-pulse space-y-4">
          {/* Video thumbnail */}
          <div className="w-full pt-[56%] bg-slate-200/20 rounded-lg relative"></div>

          {/* Video title */}
          <div className="space-y-2">
            <div className="h-6 w-full bg-slate-300/60 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-300/60 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-300/60 rounded"></div>
          </div>

          {/* Owner / channel info */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-10 h-10 rounded-full bg-slate-300/60"></div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-20 bg-slate-300/60 rounded"></div>
              <div className="h-3 w-12 bg-slate-300/60 rounded"></div>
            </div>
          </div>

          {/* Views and upload date */}
          <div className="h-3 w-32 bg-slate-300/60 rounded mt-2"></div>

          {/* Comments skeleton */}
          <div className="space-y-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-300/60"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 bg-slate-300/60 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-300/60 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side video suggestions */}
        <div className="lg:col-span-1 space-y-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex gap-2 animate-pulse">
              <div className="w-32 h-20 bg-slate-200/20 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 bg-slate-300/60 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-300/60 rounded"></div>
                <div className="h-3 w-1/3 bg-slate-300/60 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // if not video found / invalid
  if (!video)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Main video skeleton */}
        <div className="lg:col-span-2 animate-pulse space-y-4">
          {/* Video thumbnail */}
          <div className="w-full pt-[56%] bg-slate-200/20 rounded-lg relative"></div>

          {/* Video title */}
          <div className="space-y-2">
            <div className="h-6 w-full bg-slate-300/60 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-300/60 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-300/60 rounded"></div>
          </div>

          {/* Owner / channel info */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-10 h-10 rounded-full bg-slate-300/60"></div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-20 bg-slate-300/60 rounded"></div>
              <div className="h-3 w-12 bg-slate-300/60 rounded"></div>
            </div>
          </div>

          {/* Views and upload date */}
          <div className="h-3 w-32 bg-slate-300/60 rounded mt-2"></div>

          {/* Comments skeleton */}
          <div className="space-y-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-300/60"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 bg-slate-300/60 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-300/60 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side video suggestions */}
        <div className="lg:col-span-1 space-y-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex gap-2 animate-pulse">
              <div className="w-32 h-20 bg-slate-200/20 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 bg-slate-300/60 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-300/60 rounded"></div>
                <div className="h-3 w-1/3 bg-slate-300/60 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // video player controls options
  const videoPlayerControlsOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    autoplay: false,
    sources: [
      {
        src: video?.data?.videoFile?.url,
        type: "video/mp4",
      },
    ],
    poster: video?.data?.thumbnail?.url || "",
  };

  const hadlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("Player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("Player will dispose");
    });

    player.on("error", () => {
      console.error("Video.js Error:", player.error());
      // Retry loading the source after a delay
      setTimeout(() => {
        player.src(videoPlayerControlsOptions.sources);
      }, 2000);
    });
  };

  return video && !isLoading ? (
    <section className="w-full pb-[4.4rem] sm:pb-0">
      <div className="w-full flex flex-wrap gap-4 lg:flex-nowrap">
        <div className="w-full col-span-12">
          {/*  VIDEO  */}
          <div className="relative w-full mb-4 pt-[56%] overflow-hidden">
            <div className="absolute inset-0">
              <VideoPlayer
                options={videoPlayerControlsOptions}
                onReady={hadlePlayerReady}
              />
            </div>
          </div>

          {/* Video, Playlist, Like and Owner Data */}
          <div
            className="group mb-4 w-full rounded-lg border p-4 hover:bg-white/5 focus:bg-white/5 duration-300"
            role="button"
            tabIndex="0"
          >
            <div className="flex flex-wrap gap-y-3">
              {/* Video Metadata */}
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <h1 className="text-xl font-bold">{video?.data?.title}</h1>
                <p className="flex text-sm text-gray-200">
                  {video?.data?.views} Veiws || {formatTimestamp(video?.data?.createdAt)}
                </p>
              </div>

              {/* Like and playlist components */}
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                  {/* Likes */}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section></section>
  );
};

export default VideoDetails;

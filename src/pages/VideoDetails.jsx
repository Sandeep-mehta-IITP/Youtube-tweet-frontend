import {
  addVideoToPlaylist,
  createPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
} from "@/app/Slices/playlistSlice";
import { emptyVideoState } from "@/app/Slices/videoSlice";
import LoginPopup from "@/components/auth/LoginPopup";
import Comments from "@/components/Comment/Comments";
import CustomYouTubePlayer from "@/components/core/CustomYouTubePlayer";
import LikeComponent from "@/components/core/LikeComponent";
import UserProfile from "@/components/core/UserProfile";

import {
  useGetAllVideosQuery,
  useGetVideoQuery,
} from "@/features/auth/videoApi";
import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { Check, FolderPlus, MessageCircle, Share2 } from "lucide-react";
import React, { useEffect, useRef, useState, useMemo } from "react";
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

  const { isAuthenticated, userData } = useSelector(({ auth }) => auth);
  const { loading: playlistLoading, data: playlists } = useSelector(
    (state) => state.playlist
  );

  //console.log("User playlist in video details page", playlists);

  const {
    data: video,
    isLoading,
    isFetching,
    error,
    refetch: refetchVideo,
  } = useGetVideoQuery(videoId, {
    skip: !videoId,
    refetchOnMountOrArgChange: true,
  });

  const { data: allVideos } = useGetAllVideosQuery();

  const currentVideoID = videoId; // Always use URL param

  const suggestedVideos = useMemo(
    () => allVideos?.data?.docs?.filter((v) => v._id !== currentVideoID) || [],
    [allVideos, currentVideoID]
  );

  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);

  // Reset everything on videoId change
  useEffect(() => {
    if (!videoId) return;

    dispatch(emptyVideoState());
    setShowPlaylistDropdown(false);
    setShowComments(false);
    setExpandedDescription(false);
    refetchVideo();
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Dispose old player
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
  }, [videoId, dispatch, refetchVideo]);

  // Cleanup player on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const handlePlaylistVideo = (playlistId, videoId, status) => {
    if (!playlistId || !videoId) return;
    if (status) {
      dispatch(
        addVideoToPlaylist({ videoId: currentVideoID, playlistId })
      ).then(() => {
        toast.success("Video added to playlist");
      });
    } else {
      dispatch(
        removeVideoFromPlaylist({ videoId: currentVideoID, playlistId })
      ).then(() => {
        toast.success("Video removed from playlist");
      });
    }
  };

  const createNewPlaylist = (eventObj) => {
    eventObj.preventDefault();
    const name = eventObj.target.playlistName.value;
    const description = eventObj.target.playlistDescription.value;

    if (!name.trim()) return toast.error("Please enter the playlist name.");
    if (!description.trim())
      return toast.error("Please enter the playlist description.");

    dispatch(createPlaylist({ data: { name, description } }))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          dispatch(
            addVideoToPlaylist({
              playlistId: res.payload?.data?._id,
              videoId: currentVideoID,
            })
          ).then(() => {
            toast.success("Playlist created and video added");
          });
          eventObj.target.reset();
          setShowPlaylistDropdown(false);
        }
      })
      .catch(() => toast.error("Failed to create playlist"));
  };

  const handleSavePlaylist = async () => {
    if (!isAuthenticated) {
      loginPopupRef.current.open();
      return;
    }
    await dispatch(getUserPlaylists(userData?._id));
    setShowPlaylistDropdown((prev) => !prev);
  };

  // Dynamic player options based on current video
  const videoPlayerControlsOptions = useMemo(() => {
    if (!video?.data) {
      return {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [],
        poster: "/default-thumbnail.png",
        autoplay: false,
      };
    }

    return {
      controls: true,
      responsive: true,
      fluid: true,
      fill: false,
      autoplay: false,
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [
        {
          src: video.data.videoFile?.url || "",
          type: "video/mp4",
        },
      ],
      poster: video.data.thumbnail?.url || "/default-thumbnail.png",
      inactivityTimeout: 10000,
    };
  }, [video?.data]);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("waiting", () => videojs.log("Player is waiting"));
    player.on("dispose", () => videojs.log("Player will dispose"));
    player.on("error", () => {
      console.error("Video.js Error:", player.error());
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.src(videoPlayerControlsOptions.sources);
          playerRef.current.load();
        }
      }, 2000);
    });
  };

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#121212]">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Failed to load video
          </p>
          <button
            onClick={() => refetchVideo()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading / Fetching State
  if (isLoading || isFetching || !video) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 animate-pulse">
            <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            {[...Array(6)].map((Broadcast, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-40 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const descriptionText = video.data.description || "No description available.";
  const displayDescription = expandedDescription
    ? descriptionText
    : descriptionText.length > 200
      ? descriptionText.substring(0, 200) + "..."
      : descriptionText;

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 bg-white dark:bg-[#121212]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player with Black Background */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl relative">
            <CustomYouTubePlayer
              src={video.data.videoFile?.url || ""}
              poster={video.data.thumbnail?.url || "/default-thumbnail.png"}
              title={video.data.title || "Untitled Video"}
            />
            {isFetching && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {video.data.title || "Untitled Video"}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>{(video.data.views || 0).toLocaleString()} views</span>
                <span>•</span>
                <span>{formatTimestamp(video.data.createdAt)}</span>
              </p>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <LikeComponent
                  videoId={currentVideoID}
                  isLiked={video.data.isLiked}
                  totalLikes={video.data.totalLikes}
                  isDisLiked={video.data.isDisLiked}
                  totalDisLikes={video.data.totalDisLikes}
                />
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => toast.success("Link copied!"))
                  }
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={() => setShowComments((prev) => !prev)}
                  className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Comments</span>
                </button>
                <div className="relative">
                  <LoginPopup
                    ref={loginPopupRef}
                    message="Sign in to save video to playlist..."
                  />
                  <button
                    onClick={handleSavePlaylist}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                  >
                    <FolderPlus className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  {isAuthenticated && showPlaylistDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">
                        Save to playlist
                      </h2>
                      <ul className="mb-4 max-h-48 overflow-y-auto space-y-2">
                        {playlistLoading ? (
                          <li className="text-sm text-center text-gray-500 py-4">
                            Loading...
                          </li>
                        ) : playlists?.length > 0 ? (
                          playlists.map((item) => (
                            <li key={item._id} className="py-2">
                              <label className="flex items-center gap-3 cursor-pointer w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <input
                                  type="checkbox"
                                  className="hidden peer"
                                  checked={item.isVideoPresent}
                                  onChange={(e) =>
                                    handlePlaylistVideo(
                                      item._id,
                                      currentVideoID,
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="w-5 h-5 flex-shrink-0 rounded border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white flex-1">
                                  {item.name}
                                </span>
                              </label>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-center text-gray-500 py-4">
                            No playlists found. Create one below!
                          </li>
                        )}
                      </ul>
                      <form
                        onSubmit={createNewPlaylist}
                        className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700"
                      >
                        <input
                          type="text"
                          name="playlistName"
                          placeholder="Playlist name..."
                          required
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <textarea
                          name="playlistDescription"
                          placeholder="Description..."
                          required
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        />
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                        >
                          Create New Playlist
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <UserProfile username={video.data.owner?.username || "Unknown"} />

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {displayDescription}
                </p>
                {descriptionText.length > 200 && (
                  <button
                    onClick={() => setExpandedDescription((prev) => !prev)}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                  >
                    {expandedDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>

            <div className={`${showComments ? "block" : "hidden"} sm:block`}>
              <Comments
                videoId={currentVideoID}
                ownerAvatar={
                  video.data.owner?.avatar?.url || "/default-avatar.png"
                }
                onClose={() => setShowComments(false)}
              />
            </div>
          </div>
        </div>

        {/* Suggested Videos */}
        <div className="lg:col-span-1 space-y-4">
          {/* Heading */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white hidden lg:block">
            Suggested Videos
          </h2>

          {suggestedVideos.length > 0 ? (
            suggestedVideos.slice(0, 12).map((v) => (
              <div
                key={v._id}
                className="flex gap-3 cursor-pointer rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                onClick={() => {
                  navigate(`/watch/${v._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {/* Thumbnail */}
                <div className="w-44 h-24 lg:w-40 lg:h-24 xl:w-48 xl:h-28 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={v.thumbnail?.url || "/default-thumbnail.png"}
                    alt={v.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Duration */}
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatVideoDuration(v.duration)}
                  </span>
                </div>

                {/* Meta Info */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {v.title}
                  </h3>

                  <div className="mt-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {v?.ownerDetails?.username || "Unknown"}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {(v.views || 0).toLocaleString()} views •{" "}
                      {formatTimestamp(v.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
              <p>No suggested videos available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoDetails;

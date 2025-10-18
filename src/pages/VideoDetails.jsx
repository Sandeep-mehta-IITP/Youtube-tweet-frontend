import {
  addVideoToPlaylist,
  createPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
} from "@/app/Slices/playlistSlice";
import { emptyVideoState } from "@/app/Slices/videoSlice";
import LoginPopup from "@/components/auth/LoginPopup";
import Comments from "@/components/Comment/Comments";
import LikeComponent from "@/components/core/LikeComponent";
import UserProfile from "@/components/core/UserProfile";
import VideoPlayer from "@/components/core/VideoPlayer";
import {
  useGetAllVideosQuery,
  useGetVideoQuery,
} from "@/features/auth/videoApi";
import {
  formatTimestamp,
  formatVideoDuration,
} from "@/utils/helpers/formatFigure";
import { Check, FolderPlus, MessageCircle } from "lucide-react";
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

  const { isAuthenticated } = useSelector(({ auth }) => auth);
  const { loading: playlistLoading, data: playlists } = useSelector(
    (state) => state.playlist
  );

  const {
    data: video,
    isLoading,
    error,
    refetch: refetchVideo,
  } = useGetVideoQuery(videoId, {
    refetchOnMountOrArgChange: true, // Force refetch when videoId changes
  });

  const { data: allVideos } = useGetAllVideosQuery();

  const currentVideoID = video?.data?._id || "";
  const suggestedVideos = useMemo(
    () => allVideos?.data?.docs?.filter((v) => v._id !== currentVideoID) || [],
    [allVideos, currentVideoID]
  );

  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Reset states and refetch data when videoId changes
  useEffect(() => {
    if (!videoId) return;

    // Clear Redux video state
    dispatch(emptyVideoState());

    // Reset local states
    setShowPlaylistDropdown(false);
    setShowComments(false);

    // Force refetch video data
    refetchVideo();

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [videoId, dispatch, refetchVideo]);

  const handlePlaylistVideo = (playlistId, currentVideoID, status) => {
    if (!playlistId || !currentVideoID) return;
    if (status) {
      dispatch(addVideoToPlaylist({ currentVideoID, playlistId })).then(() => {
        toast.success("Video added to playlist");
      });
    } else {
      dispatch(removeVideoFromPlaylist({ currentVideoID, playlistId })).then(
        () => {
          toast.success("Video removed from playlist");
        }
      );
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
          if (!currentVideoID)
            return toast.error("No video selected to add to playlist.");
          dispatch(
            addVideoToPlaylist({
              playlistId: res.payload?.data?._id,
              currentVideoID,
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

  const handleSavePlaylist = () => {
    if (!isAuthenticated) {
      loginPopupRef.current.open();
      return;
    }
    dispatch(getUserPlaylists(currentVideoID));
    setShowPlaylistDropdown((prev) => !prev);
  };

  const videoPlayerControlsOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    fill: false, // Prevent automatic full-screen
    autoplay: false,
    sources: [
      {
        src: video?.data?.videoFile?.url || "",
        type: "video/mp4",
      },
    ],
    poster: video?.data?.thumbnail?.url || "/default-thumbnail.png",
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("waiting", () => {
      videojs.log("Player is waiting");
    });
    player.on("dispose", () => {
      videojs.log("Player will dispose");
    });
    player.on("error", () => {
      console.error("Video.js Error:", player.error());
      setTimeout(() => {
        player.src(videoPlayerControlsOptions.sources);
      }, 2000);
    });
  };

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Failed to load video
          </p>
          <button
            onClick={() => refetchVideo()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-sm font-medium transition transform active:scale-95"
            aria-label="Retry loading video"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !video) {
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
            <div className="space-y-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            {[...Array(6)].map((_, i) => (
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

  return (
    <section
      key={videoId}
      className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 bg-white dark:bg-[#121212] transition-colors duration-300"
    >
      <div key={videoId} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <VideoPlayer
              options={videoPlayerControlsOptions}
              onReady={handlePlayerReady}
            />
          </div>

          {/* Video Metadata */}
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
              {video?.data?.title || "Untitled Video"}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {video?.data?.views || 0} views •{" "}
                {formatTimestamp(video?.data?.createdAt) || "Unknown date"}
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <LikeComponent
                  videoId={video?.data?._id}
                  isLiked={video?.data?.isLiked || false}
                  totalLikes={video?.data?.totalLikes || 0}
                  isDisLiked={video?.data?.isDisLiked || false}
                  totalDisLikes={video?.data?.totalDisLikes || 0}
                />
                <button
                  onClick={() => setShowComments((prev) => !prev)}
                  className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm font-medium text-gray-900 dark:text-white transition transform active:scale-95"
                  aria-label="Toggle comments"
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
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm font-medium text-gray-900 dark:text-white transition transform active:scale-95"
                    aria-label="Save to playlist"
                  >
                    <FolderPlus className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  {isAuthenticated && showPlaylistDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 z-20 transition-all duration-200 animate-fade-in">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white text-center">
                        Save to playlist
                      </h2>
                      <ul className="mb-4 max-h-48 overflow-y-auto scrollbar-hide">
                        {playlistLoading ? (
                          <li className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Loading playlists...
                          </li>
                        ) : playlists?.length > 0 ? (
                          playlists.map((item) => (
                            <li key={item._id} className="mb-2">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="hidden peer"
                                  id={`playlist-${item._id}`}
                                  checked={item.isVideoPresent} // Use checked instead of defaultChecked
                                  onChange={(e) =>
                                    handlePlaylistVideo(
                                      item._id,
                                      currentVideoID,
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition">
                                  <Check className="w-4 h-4 text-white" />
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {item.name}
                                </span>
                              </label>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            No playlists found
                          </li>
                        )}
                      </ul>
                      <form onSubmit={createNewPlaylist} className="space-y-3">
                        <input
                          type="text"
                          name="playlistName"
                          placeholder="Enter playlist name..."
                          required
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          aria-label="Playlist name"
                        />
                        <input
                          type="text"
                          name="playlistDescription"
                          placeholder="Enter playlist description..."
                          required
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          aria-label="Playlist description"
                        />
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition transform active:scale-95"
                          aria-label="Create new playlist"
                        >
                          Create Playlist
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="w-full flex items-center">
              <UserProfile
                username={video?.data?.owner?.username || "Unknown"}
              />
            </div>

            {/* Description */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {video?.data?.description || "No description available"}
              </p>
            </div>

            {/* Comments */}
            <div className={`${showComments ? "block" : "hidden"} sm:block`}>
              <Comments
                videoId={video?.data?._id}
                ownerAvatar={
                  video?.data?.owner?.avatar?.url || "/default-avatar.png"
                }
                onClose={() => setShowComments(false)}
              />
            </div>
          </div>
        </div>

        {/* Suggested Videos */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white hidden lg:block">
            Suggested Videos
          </h2>
          {suggestedVideos.length > 0 ? (
            suggestedVideos.map((v) => (
              <div
                key={v._id}
                className="flex gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 transition"
                onClick={() => navigate(`/watch/${v._id}`)}
                role="button"
                aria-label={`Watch ${v.title}`}
              >
                <div className="w-32 sm:w-40 h-20 sm:h-24 relative flex-shrink-0">
                  <img
                    src={v.thumbnail?.url || "/default-thumbnail.png"}
                    alt={v.title || "Video thumbnail"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 px-1.5 py-0.5 text-xs text-white rounded">
                    {formatVideoDuration(v.duration) || "00:00"}
                  </span>
                </div>
                <div className="flex-1">
                  <h6 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {v.title || "Untitled Video"}
                  </h6>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {v?.ownerDetails?.username || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {v.views || 0} views •{" "}
                    {formatTimestamp(v.createdAt) || "Unknown date"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No suggested videos available
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoDetails;

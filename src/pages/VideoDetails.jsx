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
import { Check, FolderPlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
  const { data: allVideos, isLoading: allVideosLoading } =
    useGetAllVideosQuery();

  const currentVideoID = video?.data?._id;
  const suggestedVideos = allVideos?.data?.docs?.filter(
    (v) => v._id !== currentVideoID
  );

  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    return () => dispatch(emptyVideoState());
  }, [videoId, dispatch]);

  const handlePlaylistVideo = (playlistId, currentVideoID, status) => {
    if (!playlistId) return;
    if (status) {
      dispatch(addVideoToPlaylist({ currentVideoID, playlistId }));
    } else {
      dispatch(removeVideoFromPlaylist({ currentVideoID, playlistId }));
    }
  };

  
  

  const createNewPlaylist = (eventObj) => {
    eventObj.preventDefault();
    const name = eventObj.target.playlistName.value;
    const description = eventObj.target.playlistDescription.value;

    if (!name.trim()) {
      return toast.error("Please enter the playlist name.");
    }

    if (!description.trim()) {
      return toast.error("Please enter the playlist description.");
    }
    dispatch(createPlaylist({ data: { name, description } }))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (!videoId) {
            console.error("Video ID is missing");
            return toast.error("No video selected to add to playlist.");
          }
          console.log("playlist id in videodetails", res.payload?.data?._id);
          console.log("video id in videodetails", currentVideoID);
          
          
          dispatch(
            addVideoToPlaylist({
              playlistId: res.payload?.data?._id,
              videoId: currentVideoID,
            })
          );

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
    dispatch(getUserPlaylists(videoId));
    setShowPlaylistDropdown((prev) => !prev);
  };

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

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 animate-pulse">
            <div className="w-full aspect-video bg-gray-800 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-700 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-40 h-24 bg-gray-800 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-700 rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full aspect-video bg-gray-800 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-700 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-40 h-24 bg-gray-800 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-700 rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full mx-auto px-4 py-6 bg-[#0f0f0f] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="w-full aspect-video">
            <VideoPlayer
              options={videoPlayerControlsOptions}
              onReady={handlePlayerReady}
            />
          </div>

          {/* Video Metadata */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{video?.data?.title}</h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="items-start text-sm text-gray-400">
                {video?.data?.views} views •{" "}
                {formatTimestamp(video?.data?.createdAt)}
              </p>
              <div className="flex items-center gap-4">
                <LikeComponent
                  videoId={video?.data?._id}
                  isLiked={video?.data?.isLiked}
                  totalLikes={video?.data?.totalLikes}
                  isDisLiked={video?.data?.isDisLiked}
                  totalDisLikes={video?.data?.totalDisLikes}
                />
                <div className="relative">
                  <LoginPopup
                    ref={loginPopupRef}
                    message="Sign in to save video in playlist..."
                  />
                  <button
                    onClick={handleSavePlaylist}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium"
                  >
                    <FolderPlus className="w-5 h-5" />
                    Save
                  </button>
                  {isAuthenticated && (
                    <div
                      className={`absolute top-full right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg p-4 z-10 transition-transform duration-200 ${
                        showPlaylistDropdown ? "block" : "hidden"
                      }`}
                    >
                      <h2 className="text-lg font-semibold mb-4 text-center">
                        Save to playlist
                      </h2>
                      <ul className="mb-4 max-h-48 overflow-y-auto">
                        {playlistLoading ? (
                          <li className="text-sm text-gray-400">Loading...</li>
                        ) : playlists?.length > 0 ? (
                          playlists.map((item) => (
                            <li key={item._id} className="mb-2">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="hidden peer"
                                  id={`playlist-${item._id}`}
                                  defaultChecked={item.isVideoPresent}
                                  onChange={(e) =>
                                    handlePlaylistVideo(
                                      item._id,
                                      currentVideoID,
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="w-5 h-5 rounded border border-gray-600 peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </span>
                                <span className="text-sm">{item.name}</span>
                              </label>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-400">
                            No playlists found
                          </li>
                        )}
                      </ul>
                      <form onSubmit={createNewPlaylist} className="space-y-2">
                        <input
                          type="text"
                          name="playlistName"
                          id="playlist-name"
                          placeholder="Enter playlist name..."
                          required
                          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                          type="text"
                          name="playlistDescription"
                          id="playlist-description"
                          placeholder="Enter playlist description..."
                          required
                          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                        >
                          Create Playlist
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User profile */}
            <div className="w-full flex items-center">
              <UserProfile userId={video?.data?.owner?.username} />
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                {video?.data?.description}
              </p>
            </div>

            {/* Comments */}
            <Comments
              videoId={video?.data?._id}
              ownerAvatar={video?.data?.owner?.avatar?.url}
            />
          </div>
        </div>

        {/* Suggested Videos */}
        <div className="lg:col-span-1 space-y-4">
          {suggestedVideos?.map((video) => (
            <div
              key={video._id}
              className="flex gap-3 cursor-pointer hover:bg-gray-800 rounded-lg p-2"
              onClick={() => navigate(`/watch/${video._id}`)}
            >
              <div className="w-40 h-24 relative flex-shrink-0">
                <img
                  src={video.thumbnail?.url}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 px-1.5 py-0.5 text-xs text-white rounded">
                  {formatVideoDuration(video.duration) || "00:00"}
                </span>
              </div>
              <div className="flex-1">
                <h6 className="text-sm font-semibold line-clamp-2">
                  {video.title}
                </h6>
                <p className="text-xs text-gray-400 mt-1">
                  {video?.ownerDetails?.username}
                </p>
                <p className="text-xs text-gray-400">
                  {video.views} views • {formatTimestamp(video.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoDetails;

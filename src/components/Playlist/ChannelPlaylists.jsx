import { getUserPlaylists } from "@/app/Slices/playlistSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PlaylistForm from "./PlaylistForm";
import { Plus, Play, MoreVertical, Lock, Globe, Users } from "lucide-react";
import { formatTimestamp } from "@/utils/helpers/formatFigure";
import MyChannelEmptyPlaylist from "./MyChannelEmptyPlaylist";
import EmptyPlaylist from "./EmptyPlaylist";

const ChannelPlaylists = ({ owner = false }) => {
  const dialog = useRef();
  const dispatch = useDispatch();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const { username } = useParams();
  const userId = useSelector((state) => state.user.userData?._id);
  const currentUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const idToFetch = owner ? currentUser?._id : userId;
    if (!idToFetch) return;

    dispatch(getUserPlaylists(idToFetch)).then((res) => {
      setLoading(false);
      const data = res?.payload || [];
      console.log("Playlists data in channel playlists", data);

      setPlaylists(data);
    });
  }, [dispatch, owner, currentUser, userId, username]);

  const openPlaylistForm = () => dialog.current?.open();

  // Loading Skeleton
  if (loading) {
    return (
      <div className="grid gap-6 sm:gap-8 pt-6 pb-12 sm:grid-cols-2 lg:grid-cols-3 ">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="animate-pulse">
              <div className="bg-gray-800 rounded-xl aspect-video w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-5 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-7/12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (playlists.length === 0) {
    return owner ? (
      <MyChannelEmptyPlaylist onClickBtn={openPlaylistForm} />
    ) : (
      <EmptyPlaylist />
    );
  }

  return (
    <>
      <PlaylistForm ref={dialog} />

      {/* Header + Create Button */}
      <div className="flex items-center justify-between mt-3 mb-6">
        <h2 className="text-xl font-bold text-white">Playlists</h2>
      </div>

      {/* Playlists Grid */}
      <div className="grid gap-6 sm:gap-8 pb-12 sm:grid-cols-2 lg:grid-cols-3 ">
        {playlists.map((playlist) => {
          const hasVideos = playlist.totalVideos > 0;

          // Generate stacked thumbnail or fallback
          const thumbnailUrl =
            playlist.thumbnail?.url ||
            `https://via.placeholder.com/480x270/1a1a1a/ffffff?text=${encodeURIComponent(playlist.name)}`;

          return (
            <Link
              key={playlist._id}
              to={`/playlist/${playlist._id}`}
              className="group block"
            >
              <div className="space-y-2">
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
                  {hasVideos ? (
                    <>
                      {/* Main Thumbnail */}
                      <img
                        src={thumbnailUrl}
                        alt={playlist.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Video Count */}
                      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <Play className="w-3 h-3 fill-white" />
                        {playlist.totalVideos}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Empty Playlist Thumbnail */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-gray-600">
                          <Play className="w-12 h-12" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                        0 videos
                      </div>
                    </>
                  )}

                  {/* Playlist Icon (Top Left) */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm p-1.5 rounded-full">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 10h11v2H3zm0-4h15v2H3zm0 8h7v2H3zm17-2v6l-5-3z" />
                    </svg>
                  </div>

                  {/* Hover Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="px-1">
                  <h3 className="font-medium text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {playlist.totalVideos} video
                    {playlist.totalVideos !== 1 ? "s" : ""}
                    {playlist.totalVideos > 0 &&
                      ` • ${formatTimestamp(playlist.createdAt)}`}
                  </p>
                </div>

                {/* Owner: More Options */}
                {owner && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Open edit/delete menu
                    }}
                    className="absolute top-12 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10"
                  >
                    <MoreVertical className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default ChannelPlaylists;

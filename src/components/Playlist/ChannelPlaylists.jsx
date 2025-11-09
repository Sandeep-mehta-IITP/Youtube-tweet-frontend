import { getUserPlaylists } from "@/app/Slices/playlistSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PlaylistForm from "./PlaylistForm";
import { Plus, PlaySquare, MoreVertical } from "lucide-react";
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
      const data = res?.payload?.data || [];
      setPlaylists(data);
    });
  }, [dispatch, owner, currentUser, userId, username]);

  const openPlaylistForm = () => dialog.current?.open();

  // Loading Skeleton
  if (loading) {
    return (
      <div className="grid gap-6 sm:gap-8 pt-6 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="animate-pulse">
              <div className="bg-gray-800 rounded-2xl aspect-video w-full"></div>
              <div className="mt-4 space-y-3">
                <div className="h-5 bg-gray-700 rounded-lg w-11/12"></div>
                <div className="h-4 bg-gray-700 rounded-lg w-8/12"></div>
                <div className="h-3 bg-gray-700 rounded-lg w-6/12"></div>
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Playlists</h2>

        {owner && (
          <button
            onClick={openPlaylistForm}
            className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Create Playlist</span>
          </button>
        )}
      </div>

      {/* Playlists Grid */}
      <div className="grid gap-6 sm:gap-8 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {playlists.map((playlist) => {
          const hasVideos = playlist.totalVideos > 0;
          const thumbnail =
            playlist.thumbnail ||
            `https://via.placeholder.com/480x270/1a1a1a/ffffff?text=${encodeURIComponent(playlist.name)}`;

          return (
            <Link
              key={playlist._id}
              to={`/playlist/${playlist._id}`}
              className="group relative block transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Card Container */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 shadow-2xl">
                      <PlaySquare className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Video Count Badge */}
                  {hasVideos && (
                    <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                      <PlaySquare className="w-4 h-4" />
                      {playlist.totalVideos} video
                      {playlist.totalVideos > 1 ? "s" : ""}
                    </div>
                  )}

                  {/* Empty Playlist Badge */}
                  {!hasVideos && (
                    <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                      Empty
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {playlist.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {playlist.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {playlist.totalViews} view
                      {playlist.totalViews !== 1 ? "s" : ""}
                    </span>
                    <span>{formatTimestamp(playlist.createdAt)}</span>
                  </div>
                </div>

                {/* More Options (Owner only) */}
                {owner && (
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                    <MoreVertical className="w-5 h-5 text-white" />
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

import { deletePlaylist, getPlaylistByID } from "@/app/Slices/playlistSlice";
import { Edit, Trash2, Play, Clock, MoreVertical } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfrimPopup from "../core/ConfirmPopup";
import PlaylistForm from "./PlaylistForm";
import PlaylistVideoLayout from "./PlaylistVideoLayout";
import EmptyPlaylist from "./EmptyPlaylist";

const PlaylistVideos = () => {
  const dispatch = useDispatch();
  const dialog = useRef();
  const deletePlaylistDialog = useRef();
  const navigate = useNavigate();
  const { playlistId } = useParams();

  const { data: playlist } = useSelector((state) => state.playlist);
  const userData = useSelector((state) => state.auth.userData);

  const currentUser = userData?._id;
  const username = userData?.username;

  useEffect(() => {
    if (playlistId) dispatch(getPlaylistByID(playlistId));
  }, [dispatch, playlistId]);

  const playlistDeleteHandler = (isConfirm) => {
    if (isConfirm) {
      dispatch(deletePlaylist(playlistId)).then(() => {
        dispatch(getUserPlaylists(userData?._id));
      });
      navigate(`/channel/${username}/playlists`);
    }
  };

  if (!playlist) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-[#121212] min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
            {/* LEFT — Playlist Info Skeleton */}
            <div className="xl:col-span-1 space-y-4">
              <div className="rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700">
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-700/50"></div>

                {/* Text */}
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-700 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-32"></div>
                      <div className="h-3 bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* RIGHT — Playlist Videos Skeleton */}
            <div className="xl:col-span-2 space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex gap-4 bg-gray-800/40 rounded-xl p-4 border border-gray-700"
                >
                  {/* Video Thumb */}
                  <div className="w-48 h-28 bg-gray-700 rounded-lg"></div>

                  {/* Text */}
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const playlists = Array.isArray(playlist?.data)
    ? playlist.data
    : [playlist.data];

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-[#121212] min-h-screen">
      {playlists.map((playlistData) => {
        const isOwner = currentUser === playlistData?.owner?._id;
        const videoCount = playlistData?.videos?.length || 0;

        return (
          <div
            key={playlistData?._id}
            className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 border-b border-gray-800 last:border-none"
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
              {/* Playlist Info Card */}
              <div className="xl:col-span-1">
                <div className="group relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 transition-all duration-300 hover:shadow-2xl hover:border-blue-500/30">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={
                        playlistData?.thumbnail?.url ||
                        "/placeholder-playlist.jpg"
                      }
                      alt={playlistData?.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {/* Video Count Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                      <Play className="w-4 h-4 fill-white" />
                      {videoCount} {videoCount === 1 ? "video" : "videos"}
                    </div>
                    Play All Button on Hover
                    {videoCount > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="bg-white text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Playlist Details */}
                  <div className="p-5 space-y-4">
                    <h2 className="text-2xl font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {playlistData?.name}
                    </h2>

                    {/* Owner Info */}
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/user/${playlistData?.owner?.username}`}
                        className="shrink-0"
                      >
                        <img
                          src={playlistData?.owner?.avatar}
                          alt={playlistData?.owner?.username}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-700 hover:ring-blue-500 transition-all"
                        />
                      </Link>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {playlistData?.owner?.fullName}
                        </p>
                        <Link
                          to={`/user/${playlistData?.owner?.username}`}
                          className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          @{playlistData?.owner?.username}
                        </Link>
                      </div>
                    </div>

                    {/* Description */}
                    {playlistData?.description && (
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {playlistData?.description}
                      </p>
                    )}

                    {/* Action Buttons (Owner Only) */}
                    {isOwner && (
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => deletePlaylistDialog.current.open()}
                          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl transition-all duration-200 shadow-md hover:shadow-red-500/25"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>

                        <button
                          onClick={() => dialog.current.open()}
                          className="flex items-center justify-center gap-2 px-3 py-1.5  bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all duration-200 shadow-md hover:shadow-blue-500/25"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Playlist Videos List */}
              <div className="xl:col-span-2">
                {videoCount > 0 ? (
                  <div className="space-y-3">
                    {playlistData.videos.map((video, index) => (
                      <div key={video?._id} className="group flex">
                        <PlaylistVideoLayout
                          video={video}
                          playlistId={playlistData?._id}
                          owner={isOwner}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <EmptyPlaylist playlistVideos />
                  </div>
                )}
              </div>
            </div>

            {/* Modals */}
            <ConfrimPopup
              ref={deletePlaylistDialog}
              title={`Delete "${playlistData?.name}"?`}
              subtitle="This action cannot be undone."
              message="Videos in the playlist will not be deleted."
              confirm="Delete Playlist"
              cancel="Cancel"
              critical
              actionFunction={playlistDeleteHandler}
            />
            <PlaylistForm ref={dialog} playlist={playlistData} />
          </div>
        );
      })}
    </section>
  );
};

export default PlaylistVideos;

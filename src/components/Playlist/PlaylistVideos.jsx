import { deletePlaylist, getPlaylistByID } from "@/app/Slices/playlistSlice";
import { Edit, Trash2 } from "lucide-react";
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

  const currentUser = userData?._id
  const username = userData?.username

  useEffect(() => {
    if (playlistId) dispatch(getPlaylistByID(playlistId));
  }, [dispatch, playlistId]);

  const playlistDeleteHandler = (isConfirm) => {
    if (isConfirm) {
      dispatch(deletePlaylist(playlistId));
      navigate(`channel/${username}/playlists`);
    }
  };

  if (!playlist) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="text-center text-gray-400 mt-10">Loading playlist...</div>
      </section>
    );
  }

  // 🧠 Handle single or multiple playlist data
  const playlists = Array.isArray(playlist?.data)
    ? playlist.data
    : [playlist.data];

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {playlists.map((playlistData) => {
        const isOwner = currentUser === playlistData?.owner?._id;

        return (
          <div
            key={playlistData?._id}
            className="flex flex-wrap xl:flex-nowrap gap-x-4 gap-y-10 p-4 border-b border-slate-700 last:border-none"
          >
            {/* Playlist Info */}
            <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
              <div className="relative mb-2 w-full pt-[56%]">
                <div className="absolute inset-0">
                  <img
                    src={playlistData?.thumbnail}
                    alt={playlistData?.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0">
                    <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                      <div className="relative z-[1]">
                        <p className="flex justify-between">
                          <span>Playlist</span>
                          <span>
                            {playlistData?.videos?.length || 0} video
                            {(playlistData?.videos?.length || 0) > 1 ? "s" : ""}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Playlist controls */}
              {isOwner && (
                <div className="flex justify-evenly py-1 mt-4 gap-x-3 mb-3">
                  <button
                    onClick={() => deletePlaylistDialog.current.open()}
                    className="w-28 inline-flex items-center justify-center gap-x-2 px-3 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>

                  <button
                    onClick={() => dialog.current.open()}
                    className="w-28 inline-flex items-center justify-center gap-x-2 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
                  >
                    <Edit className="w-5 h-5" /> Edit
                  </button>

                  <ConfrimPopup
                    ref={deletePlaylistDialog}
                    title={`Confirm to Delete '${playlistData?.name}'?`}
                    subtitle="Once playlist is deleted that cannot be undone."
                    message="Note: The videos within the playlist won't be deleted."
                    confirm="Delete"
                    cancel="Cancel"
                    critical
                    actionFunction={playlistDeleteHandler}
                  />
                  <PlaylistForm ref={dialog} playlist={playlistData} />
                </div>
              )}

              <h2 className="mb-1 text-2xl text-[#f6f5f6] font-semibold">
                {playlistData?.name}
              </h2>

              {/* Owner Details */}
              <div className="mt-4 flex items-center gap-x-3">
                <div className="w-12 h-12 shrink-0">
                  <Link to={`/user/${playlistData?.owner?.username}`}>
                    <img
                      src={playlistData?.owner?.avatar}
                      alt={playlistData?.owner?.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </Link>
                </div>

                <div>
                  <h6 className="text-sm text-[#f6f5f6] font-medium">
                    {playlistData?.owner?.fullName}
                  </h6>
                  <p className="text-sm text-white/70 font-medium">
                    <Link
                      to={`/user/${playlistData?.owner?.username}`}
                      className="hover:text-sky-500 transition-colors duration-200"
                    >
                      @{playlistData?.owner?.username}
                    </Link>
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-[#f6f5f6] font-semibold">
                {playlistData?.description}
              </p>
            </div>

            {/* Playlist videos */}
            <ul className="w-full flex flex-col gap-y-4">
              {playlistData?.videos?.length > 0 ? (
                playlistData.videos.map((video) => (
                  <PlaylistVideoLayout
                    key={video?._id}
                    video={video}
                    playlistId={playlistData?._id}
                    owner={isOwner}
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <EmptyPlaylist playlistVideos />
                </div>
              )}
            </ul>
          </div>
        );
      })}
    </section>
  );
};

export default PlaylistVideos;

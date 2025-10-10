import { getUserPlaylists } from "@/app/Slices/playlistSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PlaylistForm from "./PlaylistForm";
import { Plus } from "lucide-react";
import { formatTimestamp } from "@/utils/helpers/formatFigure";
import MyChannelEmptyPlaylist from "./MyChannelEmptyPlaylist";
import EmptyPlaylist from "./EmptyPlaylist";

const ChannelPlaylists = ({ owner = false }) => {
  const dialog = useRef();
  const dispatch = useDispatch();
  const [playlists, setPlaylists] = useState(null);
  const [loading, setLoading] = useState(true);

  let { username } = useParams();
  let userId = useSelector((state) => state.user.userData?._id);
  let currentUser = useSelector((state) => state.auth.userData);

  console.log("UserId in channel playlist", userId);
  console.log("Current user in channel Playlist", currentUser);
  
  

  useEffect(() => {
    if (owner) {
      userId = currentUser?._id;
    }

    if (!userId) return;

    dispatch(getUserPlaylists(userId)).then((res) => {
      setLoading(false);
      setPlaylists(res.payload);
    });
  }, [username, userId]);

  const popupPlaylistForm = () => {
    dialog.current.open();
  };

  if (loading) {
    return (
      <div className="grid gap-4 pt-2 mt-3 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="w-full">
            <div className="relative mb-1 w-full pt-[62%]">
              <div className="absolute inset-0">
                {/* Skeleton for the image */}
                <div className="h-full w-full bg-slate-100/10 animate-pulse"></div>
                <div className="absolute inset-x-0 bottom-0">
                  <div className="relative border-t bg-white/10 p-4 backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                    <div className="relative z-[1]">
                      <div className="flex justify-between">
                        <div className="inline-block h-6 mb-2 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
                        <div className="inline-block h-6 bg-slate-100/10 rounded w-20 animate-pulse"></div>
                      </div>
                      <div className="text-sm text-gray-700 h-6 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-1 font-semibold h-5 bg-slate-100/10 rounded w-1/2 animate-pulse"></div>
            <div className="flex h-5 bg-slate-100/10 rounded w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <PlaylistForm ref={dialog} />
      {playlists?.length > 0 ? (
        <>
          {/* Create new playlist */}
          {owner && playlists.length > 0 && (
            <div className="flex items-center justify-center px-2 py-2">
              <button
                onCanPlay={popupPlaylistForm}
                className="mt-5 inline-flex items-center gap-x-3 border border-transparent hover:border-dotted hover:border-white px-4 py-2 font-semibold bg-blue-400 text-[#121212]"
              >
                <Plus className="w-5 h-5" />
                New Playlist
              </button>
            </div>
          )}

          {/* Playlists */}
          <ul
            className={`grid gap-4 pt-2 grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] ${
              playlists?.length < 4 &&
              "lg:grid-cols-[repeat(auto-fit,_minmax(400px,400px))]"
            }`}
          >
            {playlists.map(
              (playlist) =>
                playlist.videoCount > 0 &&
                owner && (
                  <li key={playlist._id} className="w-full">
                    <Link to={`/playlist/${playlist._id}`}>
                      {/* playlist thumbnail */}
                      <div className="relative w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src={playlist.thumbnail}
                            alt={playlist.name}
                            className="w-full h-full resize"
                          />

                          <div className="absolute inset-x-0 bottom-0">
                            <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                              <div className="relative z-[1]">
                                <p className="flex justify-between">
                                  {/* Playlist name */}
                                  <span className="inline-block text-lg font-medium text-[#f6f5f6]">
                                    {playlist.name}
                                  </span>

                                  {/* Platlist videos count */}
                                  <span className="inline-block text-sm font-medium text-[#f6f5f6]">
                                    {playlist.videosCount} video
                                    {playlist.videosCount > 1 ? "s" : ""}
                                  </span>
                                </p>

                                {/* Playlist creation time */}
                                <p className="text-sm text-gray-200">
                                  {playlist.totalViews} view
                                  {playlist.totalViews > 1 ? "s" : ""} ·{" "}
                                  {formatTimestamp(playlist.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Playlist discription */}
                      <div className="flex py-2 px-3 min-h-8 bg-[#21212199]">
                        <p className="flex text-sm text-gray-200 max-h-12 overflow-hidden">
                          {playlist.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                )
            )}
          </ul>
        </>
      ) : owner ? (
        <MyChannelEmptyPlaylist onClickBtn={popupPlaylistForm} />
      ) : (
        <EmptyPlaylist />
      )}
    </>
  );
};

export default ChannelPlaylists;

import { deletePlaylist, getPlaylistByID } from "@/app/Slices/playlistSlice";
import { Edit, Trash2 } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfrimPopup from "../core/ConfirmPopup";
import PlaylistForm from "./PlaylistForm";
import PlaylistVideoLayout from "./PlaylistVideoLayout";

const PlaylistVideos = () => {
  const dispatch = useDispatch();
  const dialoag = useRef();
  const deletePlaylistDialog = useRef();
  const navigate = useNavigate();
  const { playlistId } = useParams();

  const { data: playlist } = useSelector((state) => state.playlist);
  const currentUser = useSelector((state) => state.auth.userData?._id);

  useEffect(() => {
    if (!playlist) return;
    dispatch(getPlaylistByID(playlistId));
  }, [playlistId]);

  const playlistDeleteHandler = (isConfrim) => {
    if (isConfrim) {
      dispatch(deletePlaylist(playlistId));
      navigate("/");
    }
  };

  if (!playlist) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
          <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
            <div className="relative mb-2 w-full pt-[56%]">
              <div className="absolute inset-0">
                {/* Skeleton for the image */}
                <div className="h-full w-full bg-white/10 animate-pulse"></div>
                <div className="absolute inset-x-0 bottom-0 ">
                  <div className="relative border-t border-t-slate-600 bg-white/10 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                    <div className="relative z-[1] ">
                      {/* Skeleton for the text */}
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Skeleton for the title */}
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-1 animate-pulse"></div>
            {/* Skeleton for the description */}
            <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
            <div className="mt-6 flex items-center gap-x-3">
              {/* Skeleton for the avatar */}
              <div className="h-16 w-16 shrink-0">
                <div className="h-full w-full bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <div className="w-full">
                {/* Skeleton for the owner's name and subscribers */}
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          <ul className="flex w-full flex-col gap-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border border-slate-600">
                <div className="w-full max-w-3xl gap-x-4 sm:flex">
                  {/* Video Thumbnail Skeleton */}
                  <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                    <div className="w-full pt-[56%]">
                      <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Video Details Skeleton */}
                  <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                    {/* Avatar for mobile */}
                    <div className="h-10 w-10 shrink-0 sm:hidden bg-gray-700 rounded-full animate-pulse"></div>

                    {/* Title and info */}
                    <div className="w-full">
                      <div className="my-4 font-semibold sm:max-w-[75%] bg-gray-700 h-4 animate-pulse"></div>
                      <p className="flex text-sm text-gray-200 sm:mt-3 bg-gray-700 h-4 animate-pulse w-3/4"></p>

                      {/* Owner Avatar and info */}
                      <div className="flex items-center gap-x-4 my-4">
                        <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="text-sm text-gray-200 bg-gray-700 h-4 animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  let isOwner = currentUser === playlist?.owner?._id;

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-wrap xl:flex-nowrap gap-x-4 gap-y-10 p-4">
        {/* Playlist Info */}
        <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0">
              <img
                src={playlist?.thumbnail}
                alt={playlist?.name}
                className="w-full h-full rounded-full"
              />

              <div className="absolute inset-x-0 bottom-0">
                <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                  <div className="relative z-[1]">
                    <p className="flex justify-between">
                      <span className="inline-block">Playlist</span>
                      <span className="inline-block">
                        {playlist?.videosCount} video
                        {playlist?.videosCount > 1 ? "s" : ""}
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
              {/* Delete button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => deletePlaylistDialog.current.open()}
                  className="w-28 inline-flex items-center justify-center gap-x-2 px-3 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>

              {/* Edit button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => dialoag.current.open()}
                  className="w-28 inline-flex items-center justify-center gap-x-2 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                >
                  <Edit className="w-5 h-5" />
                  Edit
                </button>
              </div>
              <ConfrimPopup
                ref={deletePlaylistDialog}
                title={`Confirm to Delete '${playlist?.name}'?`}
                subtitle="Once playlist is deleted that cannot be undone."
                message="Note: The videos within the playlist won't be deleted."
                confirm="Delete"
                cancel="Cancel"
                critical
                actionFunction={playlistDeleteHandler}
              />

              <PlaylistForm ref={dialoag} playlist={playlist} />
            </div>
          )}

          <h2 className="mb-1 text-2xl text-[#f6f5f6] font-semibold">
            {playlist?.name}
          </h2>

          {/* Owner Details */}
          <div className="mt-4 flex items-center gap-x-3">
            {/* Playlist owner avatar */}
            <div className="w-12 h-12 shrink-0 ">
              <Link to={`/user/${playlist?.owner?.username}`}>
                <img
                  src={playlist?.owner?.avatar}
                  alt={playlist?.owner?.username}
                  className="w-full h-full rounded-full"
                />
              </Link>
            </div>

            <div className="w-full">
              {/* Playlist owner fullName */}
              <h6 className="text-sm text-[#f6f5f6] font-medium">
                {playlist?.owner?.fullName}
              </h6>

              {/* Playlist owner username */}
              <p className="text-sm text-white/70 font-medium">
                <Link
                  to={`/user/${playlist?.owner?.username}`}
                  className="hover:text-sky-500 transition-colors duration-200"
                >
                  @{playlist?.owner?.username}
                </Link>
              </p>
            </div>
          </div>

          {/* Playlist discription */}
          <p className="flex mt-3 text-sm text-[#f6f5f6] font-semibold">
            {playlist?.description}
          </p>
        </div>

        {/* Playlist videos */}
        <ul className="w-full flex flex-col gap-y-4">
          {playlist?.videos?.length > 0 || (
            <div className="w-full h-full flex items-center justify-center">
              <EmptyPlaylist playlistVideos />
            </div>
          )}

          {playlist?.videos?.map((video) => (
            <PlaylistVideoLayout
              key={video?._id}
              video={video}
              playlistId={playlistId}
              owner={isOwner}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PlaylistVideos;

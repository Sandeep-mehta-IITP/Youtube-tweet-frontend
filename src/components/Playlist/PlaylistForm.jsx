import { createPlaylist, updatePlaylist } from "@/app/Slices/playlistSlice";
import { playlistSchema } from "@/utils/Validation/PlaylistSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Cross } from "lucide-react";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const PlaylistForm = ({ playlist }, ref) => {
  const dialog = useRef();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(playlistSchema),
    defaultValues: {
      name: playlist?.name || "",
      description: playlist?.description || "",
    },
  });

  const [showPopup, setShowPopup] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open() {
        setShowPopup(true);
      },
      close() {
        dialog.current.close();
      },
    };
  });

  useEffect(() => {
    if (showPopup) {
      dialog.current.showModal();
    }
  }, [showPopup]);

  const handleClose = () => {
    dialog.current.close();
    setShowPopup(false);
  };

  const updatePlaylistHandler = (data) => {
    if (playlist) {
      dispatch(updatePlaylist({ playlistId: playlist?._id, data })).then(
        (res) => {
          if (res.meta.requestStatus === "fulfilled") {
            dialog.current.close();
          }
        }
      );
    } else {
      dispatch(createPlaylist({ data })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          dialog.current.close();
        }
      });
    }
  };
  return (
    <section className="absolute">
      {showPopup &&
        createPortal(
          <dialog
            ref={dialog}
            className="h-full items-center backdrop:backdrop-blur-sm"
            onClick={handleClose}
          >
            <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
              <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
                <form
                  onSubmit={handleSubmit(updatePlaylistHandler)}
                  className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 text-white bg-[#121212] p-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-[#f6f5f6] font-semibold">
                      {playlist ? "Edit" : "Create"} Playlist
                      <span className="block text-sm text-gray-200">
                        Share where you&#x27;ve worked on your profile.
                      </span>
                    </h2>
                    <button
                      autoFocus
                      type="button"
                      onClick={() => dialog.current.close()}
                      className="focus:border focus:border-dotted hover:border-dotted hover:border"
                    >
                      <Cross className="w-5 h-5 text-[#f6f5f6] font-semibold" />
                    </button>
                  </div>

                  {/* Input */}
                  <div className="flex flex-col mb-6 gap-y-5 ">
                    {/* Name */}
                    <div className="w-full">
                      {/* Title */}
                      <label htmlFor="name" className="mb-2 inline-block">
                        Title <span className="text-red-600 font-bold">*</span>
                      </label>

                      {/* Name Input */}
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter the playlist name..."
                        {...register("name")}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.name && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors?.name?.message}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="w-full">
                      {/* Title */}
                      <label
                        htmlFor="description"
                        className="mb-2 inline-block"
                      >
                        Title <span className="text-red-600 font-bold">*</span>
                      </label>

                      {/* Description Input */}
                      <textarea
                        id="description"
                        placeholder="Enter playlist description..."
                        {...register("description")}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>

                      {errors.description && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors?.description?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={() => dialog.current.close()}
                      className="px-4 py-2.5 border hover:border-dotted border-white hover:bg[#212121FF]"
                    >
                      Cancel
                    </button>

                    {/* Update or Create button */}
                    <button
                      type="submit"
                      disabled={errors.name}
                      className="bg-blue-500 hover:bg-blue-700/90 border hover:border-dotted border-white px-4 py-2.5 text-[#f6f5f6] font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      {playlist ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>,
          document.getElementById("popup-models")
        )}
    </section>
  );
};

export default React.forwardRef(PlaylistForm);

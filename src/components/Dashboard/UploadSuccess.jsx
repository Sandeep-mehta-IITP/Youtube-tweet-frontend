import React, { useRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { X, FileVideo, CheckCircle2 } from "lucide-react";

const UploadSuccess = ({ video, updating = false }, ref) => {
  const dialog = useRef();

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
    },
  }));

  return createPortal(
    <dialog
      ref={dialog}
      className="h-full text-white backdrop:backdrop-blur-sm"
    >
      <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
          <div className="inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
            <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-5 shadow-xl">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-xl font-semibold">
                  Video {updating ? "Updated" : "Uploaded"} Successfully 🎉
                  <span className="block text-sm text-gray-300">
                    Track your video {updating ? "update" : "upload"} progress.
                  </span>
                </h2>
                <button
                  onClick={() => dialog.current.close()}
                  className="p-1 text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File Info Section */}
              <div className="mb-6 flex gap-x-3 border border-gray-700 rounded-lg p-3 bg-[#181818]">
                <div className="w-10 shrink-0 flex items-center justify-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                    <FileVideo className="w-5 h-5" />
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <h6 className="font-medium">
                    {updating
                      ? "Updated " + video.title
                      : video?.videoFile?.[0]?.name || "Untitled Video"}
                  </h6>
                  {!updating && (
                    <p className="text-sm text-gray-400">
                      {video?.videoFile?.[0]
                        ? `${(video.videoFile[0].size / 1000000).toFixed(2)} MB`
                        : ""}
                    </p>
                  )}

                  <div className="mt-2 flex items-center text-sm text-blue-400">
                    <CheckCircle2 className="w-5 h-5 mr-1" />
                    Video {updating ? "Updated" : "Uploaded"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => dialog.current?.close()}
                  className="border border-gray-700 bg-transparent hover:bg-gray-800 text-white font-medium px-4 py-3 rounded-md transition"
                >
                  Close
                </button>
                <button
                  onClick={() => dialog.current?.close()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-3 rounded-md transition"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    document.getElementById("popup-models")
  );
};

export default React.forwardRef(UploadSuccess);

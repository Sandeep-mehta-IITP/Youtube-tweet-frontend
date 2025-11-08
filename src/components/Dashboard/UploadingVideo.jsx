import { Loader2, Table, X } from "lucide-react";
import React, { useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import ConfirmPopup from "../core/ConfirmPopup";

const UploadingVideo = ({ video, abort, updating = false }, ref) => {
  const dialog = useRef();
  const confirmCancelDialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  const handleCancel = (isConfirm) => {
    if (isConfirm) abort();
  };
  return createPortal(
    <dialog
      ref={dialog}
      onClose={() => confirmCancelDialog.current?.close()}
      className="h-full text-white backdrop:backdrop-blur-sm"
    >
      <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
          <div className="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
            <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-xl font-semibold">
                  {updating ? "Updating" : "Uploading"} Video...
                  <span className="block text-sm text-gray-300">
                    Track your video {updating ? "Updating" : "Uploading"}{" "}
                    process.
                  </span>
                </h2>
                <button
                  onClick={() => dialog.current?.close()}
                  className="h-6 w-6"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <div className="mb-6 flex gap-x-2 border p-3">
                <div className="w-8 shrink-0">
                  <span className="inline-block w-full rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-colors duration-200">
                    <Table className="w-6 h-6 text-gray-700" />
                  </span>
                </div>

                <div className="flex flex-col">
                  <h6>
                    {updating
                      ? "Updating " + video.title
                      : video?.videoFile?.length > 0 &&
                        video?.videoFile[0].name}
                  </h6>
                  {!updating && (
                    <p className="text-sm">
                      {video?.videoFile?.length > 0 &&
                        (video?.videoFile[0].size / 1000000).toFixed(2)}{" "}
                      MB
                    </p>
                  )}
                  <div className="mt-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="ml-2">
                      {updating ? "Updating" : "Uploading"}...
                    </span>
                  </div>
                </div>
              </div>

              {!updating && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => dialog.current.close()}
                    className="border px-4 py-3"
                  >
                    Close
                  </button>
                  <ConfirmPopup
                    ref={confirmCancelDialog}
                    actionFunction={handleCancel}
                    title="Are you sure to cancel the Upload?"
                  />
                  <button
                    onClick={() => confirmCancelDialog.current.open()}
                    className="bg-[#3B82F6] text-white transition-colors duration-200 px-4 py-3 disabled:bg-[#29369a]"
                  >
                    Cancel Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    document.getElementById("popup-models")
  );
};

export default UploadingVideo;

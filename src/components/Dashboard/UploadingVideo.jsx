import React, { useImperativeHandle, useRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, X, Film } from "lucide-react";
import ConfirmPopup from "../core/ConfirmPopup";

const UploadingVideo = forwardRef(({ video, abort, updating = false }, ref) => {
  const dialogRef = useRef(null);
  const confirmRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    },
    close: () => {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    },
  }));

  const handleCancel = (confirmed) => {
    if (confirmed) {
      abort?.();
      dialogRef.current?.close();
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[9999] m-0 h-full w-full border-0 bg-transparent backdrop:bg-black/70 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
      style={{ padding: 0 }}
    >
      {/* Main Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-700 bg-[#121212] p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {updating ? "Updating Video" : "Uploading Video"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {updating
                ? "Saving your changes..."
                : "Please wait while we upload your video"}
            </p>
          </div>
          {!updating && (
            <button
              onClick={() => dialogRef.current?.close()}
              className="rounded-full p-2 hover:bg-gray-800 transition"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Video Info */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-700 bg-gray-900/50 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600">
            <Film className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">
              {updating
                ? video?.title || "Updating video..."
                : video?.videoFile?.[0]?.name || "Uploading video..."}
            </p>
            <p className="text-sm text-gray-400">
              {updating ? "Applying changes" : "Processing file"}
            </p>
          </div>
        </div>

        {/* Loader */}
        <div className="flex items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-white">
            {updating ? "Updating your video..." : "Uploading your video..."}
          </span>
        </div>

        {/* Buttons (only for upload) */}
        {!updating && (
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => dialogRef.current?.close()}
              className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-6 py-3 font-medium text-gray-300 hover:bg-gray-700 transition"
            >
              Upload in Background
            </button>
            <button
              onClick={() => confirmRef.current?.open()}
              className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 transition"
            >
              Cancel Upload
            </button>
          </div>
        )}
      </div>

      {/* Confirm Cancel Popup */}
      <ConfirmPopup
        ref={confirmRef}
        actionFunction={handleCancel}
        title="Cancel upload?"
        message="This will permanently stop the upload."
      />
    </dialog>,
    document.getElementById("popup-models")
  );
});

export default UploadingVideo;

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, X, Trash2, Film } from "lucide-react";

const DeletingVideo = forwardRef(({ video, onClose }, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => {
      dialogRef.current?.close();
      onClose?.();
    },
  }));

  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[9999] m-0 h-full w-full border-0 bg-transparent backdrop:bg-black/70 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
      style={{ padding: 0 }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-700 bg-[#121212] p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Deleting Video</h2>
            <p className="mt-1 text-sm text-gray-400">
              Please wait while we permanently remove your video...
            </p>
          </div>
          <button
            onClick={() => dialogRef.current?.close()}
            className="rounded-full p-2 hover:bg-gray-800 transition opacity-50 cursor-not-allowed"
            disabled
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Video Info */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-700 bg-gray-900/50 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600">
            <Trash2 className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white line-clamp-2">
              {video?.title || "Untitled video"}
            </p>
            <p className="text-sm text-gray-400">
              {video?.views?.toLocaleString() || 0} views • Permanent deletion
            </p>
          </div>
        </div>

        {/* Loader */}
        <div className="flex items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-red-500" />
          <span className="text-lg font-medium text-white">
            Deleting your video permanently...
          </span>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-gray-500">
          This action cannot be undone.
        </div>
      </div>
    </dialog>,
    document.getElementById("popup-models")
  );
});

DeletingVideo.displayName = "DeletingVideo";
export default DeletingVideo;

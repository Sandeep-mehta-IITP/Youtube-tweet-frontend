import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

function DeleteVideo({
  isOpen = true,
  onClose,
  onConfirm,
  videoTitle = "My Awesome Video",
  videoViews = 1234,
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/95 shadow-2xl ring-1 ring-gray-700/50">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-900/40 ring-4 ring-red-900/20">
            <Trash2 className="h-6 w-6 text-red-400" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Delete Video</h2>
            <p className="mt-1 text-sm text-gray-400">
              Are you sure you want to delete this video? This action{" "}
              <span className="font-medium text-red-400">cannot be undone</span>
              .
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="ml-auto rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Info */}
        <div className="border-t border-gray-700/60 bg-gray-800/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-700 text-xs font-medium text-gray-300">
              <AlertTriangle size={16} className="text-yellow-400" />
            </div>
            <div>
              <p
                className="text-sm font-medium text-white line-clamp-1"
                title={videoTitle}
              >
                {videoTitle}
              </p>
              <p className="text-xs text-gray-400">
                {videoViews.toLocaleString()} views • Permanent deletion
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="px-6 pt-4">
          <div className="flex items-start gap-3 rounded-lg border border-orange-800/60 bg-orange-900/20 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
            <p className="text-xs text-orange-300">
              This video will be removed from all playlists, search results, and
              your channel. Viewers will no longer be able to watch it.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-5 py-3 text-gray-300 
                       transition hover:border-gray-500 hover:bg-gray-700 hover:text-white 
                       focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 
                       font-medium text-white transition hover:bg-red-500 
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                       focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete Video
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteVideo;

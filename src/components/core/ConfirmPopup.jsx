import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle } from "lucide-react";

const ConfirmPopup = forwardRef(
  (
    {
      title = "Confirm Action",
      subtitle = "",
      message = "Are you sure you want to proceed?",
      confirm = "Confirm",
      cancel = "Cancel",
      critical = false,
      checkbox = null,
      actionFunction,
    },
    ref
  ) => {
    const dialogRef = useRef(null);
    const checkboxRef = useRef(null);

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    const handleConfirm = () => {
      if (checkbox && !checkboxRef.current?.checked) return;
      actionFunction?.(true);
      dialogRef.current?.close();
    };

    const handleCancel = () => {
      actionFunction?.(false);
      dialogRef.current?.close();
    };

    return createPortal(
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-[9999] m-0 h-full w-full border-0 bg-transparent backdrop:bg-black/70 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
      >
        <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${critical ? "bg-red-900/40" : "bg-yellow-900/40"}`}>
                <AlertTriangle className={`h-5 w-5 ${critical ? "text-red-400" : "text-yellow-400"}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message */}
          <div className="mt-4 text-sm text-gray-300">{message}</div>

          {/* Checkbox (optional) */}
          {checkbox && (
            <div className="mt-4 flex items-center gap-3">
              <input type="checkbox" ref={checkboxRef} id="confirm-checkbox" className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-500" />
              <label htmlFor="confirm-checkbox" className="text-sm text-gray-300">
                {checkbox}
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition"
            >
              {cancel}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 rounded-xl px-4 py-2.5 font-medium text-white transition ${
                critical
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirm}
            </button>
          </div>
        </div>
      </dialog>,
      document.getElementById("popup-models")
    );
  }
);

ConfirmPopup.displayName = "ConfirmPopup";
export default ConfirmPopup;
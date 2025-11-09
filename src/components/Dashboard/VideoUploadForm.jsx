import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { publishVideo, updateVideo } from "../../app/Slices/videoSlice";
import { getChannelVideos } from "@/app/Slices/dashboardSlice";
import { Upload, X, Image, Film, FileText, CheckCircle } from "lucide-react";
import UploadingVideo from "./UploadingVideo";
import UploadSuccess from "./UploadSuccess";

const VideoUploadForm = forwardRef(({ video = null }, ref) => {
  const uploadingRef = useRef();
  const successRef = useRef();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadData, setCurrentUploadData] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    video?.thumbnail?.url || null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
    },
  });

  const watchedVideoFile = watch("videoFile");
  const watchedThumbnail = watch("thumbnail");

  useEffect(() => {
    document.body.style.overflow = isOpen || isUploading ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen, isUploading]);

  useEffect(() => {
    if (watchedVideoFile?.[0]) {
      const url = URL.createObjectURL(watchedVideoFile[0]);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedVideoFile]);

  useEffect(() => {
    if (watchedThumbnail?.[0]) {
      const url = URL.createObjectURL(watchedThumbnail[0]);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedThumbnail]);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
    close() {
      setIsOpen(false);
      setIsUploading(false);
      reset();
      setVideoPreview(null);
      setThumbnailPreview(video?.thumbnail?.url || null);
      setCurrentUploadData(null);
    },
  }));

  const handleAbort = () => {
    abortController?.abort();
    setIsUploading(false);
    uploadingRef.current?.close();
  };

  const onSubmit = async (data) => {
    // Store current form data
    setCurrentUploadData(data);

    const formData = new FormData();
    if (data.title?.trim()) formData.append("title", data.title.trim());
    if (data.description?.trim())
      formData.append("description", data.description.trim());
    if (data.videoFile?.[0]) formData.append("videoFile", data.videoFile[0]);
    if (data.thumbnail?.[0]) formData.append("thumbnail", data.thumbnail[0]);

    const controller = new AbortController();
    setAbortController(controller);

    let promise;

    // Close form, start uploading UI
    setIsOpen(false);
    setIsUploading(true);
    uploadingRef.current?.open();

    try {
      if (video) {
        promise = dispatch(
          updateVideo({
            videoId: video._id,
            data: formData,
            signal: controller.signal,
          })
        );
      } else {
        promise = dispatch(
          publishVideo({
            data: formData,
            signal: controller.signal,
          })
        );
      }

      await promise.unwrap();

      // Success
      setIsUploading(false);
      uploadingRef.current?.close();
      successRef.current?.open();

      reset(); // clears form fields
      setVideoPreview(null);
      setThumbnailPreview(null);
      setCurrentUploadData(null);

      dispatch(getChannelVideos());
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Upload aborted");
      } else {
        console.error("Upload failed:", err);
        // Optional: show error toast
      }
      setIsUploading(false);
      uploadingRef.current?.close();
    } finally {
      setAbortController(null);
      setCurrentUploadData(null);
    }
  };

  // Always render modals (critical for refs)
  return createPortal(
    <>
      {/* Always mounted modals */}
      <UploadingVideo
        ref={uploadingRef}
        abort={handleAbort}
        video={video || currentUploadData}
        updating={!!video}
      />
      <UploadSuccess
        ref={successRef}
        video={video || currentUploadData}
        updating={!!video}
      />

      {/* Only show form when isOpen */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="relative w-[95%] max-w-5xl max-h-[93vh] overflow-y-auto rounded-2xl bg-[#111827]/95 border border-gray-700 shadow-2xl backdrop-blur-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-900/90 p-5">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Film className="text-blue-400" size={30} />
                  {video ? "Edit Video" : "Upload Video"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {video
                    ? "Update your video details"
                    : "Share your masterpiece"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-gray-800 text-gray-400 hover:text-white transition"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                {/* LEFT: Video & Thumbnail */}
                <div className="space-y-6">
                  {!video && (
                    <div>
                      <label className="mb-3 block text-lg font-semibold text-white">
                        <Upload
                          className="inline mr-2 text-blue-400"
                          size={20}
                        />
                        Video File <span className="text-red-400">*</span>
                      </label>
                      <label
                        htmlFor="videoFile"
                        className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/50 p-8 text-center hover:border-blue-500 transition-all"
                      >
                        <input
                          id="videoFile"
                          type="file"
                          accept="video/mp4,video/webm"
                          {...register("videoFile", { required: !video })}
                          className="sr-only"
                        />
                        {videoPreview ? (
                          <div className="space-y-3">
                            <video
                              src={videoPreview}
                              controls
                              className="mx-auto max-h-56 rounded-xl"
                            />
                            <p className="text-sm text-green-400 flex items-center justify-center gap-2">
                              <CheckCircle size={16} /> Ready to upload
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload
                              size={50}
                              className="mx-auto text-blue-400"
                            />
                            <p className="text-white font-medium">
                              Drop video here
                            </p>
                            <p className="text-sm text-gray-400">
                              Max 2GB • MP4/WebM
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  )}

                  <div>
                    <label className="mb-3 block text-lg font-semibold text-white">
                      <Image className="inline mr-2 text-blue-400" size={20} />
                      Thumbnail{" "}
                      {!video && <span className="text-red-400">*</span>}
                    </label>
                    <label
                      htmlFor="thumbnail"
                      className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/50 hover:border-blue-500 transition-all"
                    >
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        {...register("thumbnail", { required: !video })}
                        className="sr-only"
                      />
                      {thumbnailPreview ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden">
                          <img
                            src={thumbnailPreview}
                            alt="thumb"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition">
                            <Upload className="text-white" size={28} />
                          </div>
                        </div>
                      ) : (
                        <div className="py-10 text-center">
                          <Image size={40} className="mx-auto text-blue-400" />
                          <p className="mt-3 text-white">Click to upload</p>
                          <p className="text-xs text-gray-400">
                            1280x720 recommended
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* RIGHT: Title & Description */}
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      <FileText className="inline mr-1" size={16} /> Title{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("title", {
                        required: !video && "Title required",
                      })}
                      maxLength={100}
                      className="w-full rounded-xl border border-gray-600 bg-gray-800/50 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Enter title..."
                    />
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-red-400">
                        {errors.title?.message}
                      </span>
                      <span className="text-gray-400">
                        {watch("title")?.length || 0}/100
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={6}
                      maxLength={5000}
                      className="w-full resize-none rounded-xl border border-gray-600 bg-gray-800/50 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Tell viewers about your video..."
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {watch("description")?.length || 0}/5000
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-6 py-4 font-medium text-gray-300 hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={Object.keys(errors).length > 0}
                      className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Upload size={20} />
                      {video ? "Update Video" : "Publish Now"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>,
    document.getElementById("popup-models")
  );
});

VideoUploadForm.displayName = "VideoUploadForm";

export default VideoUploadForm;

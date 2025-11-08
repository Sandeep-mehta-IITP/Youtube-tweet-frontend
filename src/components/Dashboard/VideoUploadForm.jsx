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
import { Upload, X, Image, Film, FileText, CheckCircle } from "lucide-react";
import UploadingVideo from "./UploadingVideo";
import UploadSuccess from "./UploadSuccess";

const VideoUploadForm = forwardRef(({ video = null }, ref) => {
  const dialogRef = useRef(null);
  const uploadingRef = useRef(null);
  const successRef = useRef(null);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [uploadPromise, setUploadPromise] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    video?.thumbnail || null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
    },
  });

  const watchedVideoFile = watch("videoFile");
  const watchedThumbnail = watch("thumbnail");

  // Video Preview
  useEffect(() => {
    if (watchedVideoFile?.[0]) {
      const file = watchedVideoFile[0];
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedVideoFile]);

  // Thumbnail Preview
  useEffect(() => {
    if (watchedThumbnail?.[0]) {
      const file = watchedThumbnail[0];
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedThumbnail]);

  // Ref methods
  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
      dialogRef.current?.showModal();
    },
    close() {
      dialogRef.current?.close();
      setIsOpen(false);
      reset();
      setVideoPreview(null);
      setThumbnailPreview(video?.thumbnail || null);
    },
  }));

  const handleAbort = () => uploadPromise?.abort?.();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    if (data.videoFile?.[0]) formData.append("videoFile", data.videoFile[0]);
    if (data.thumbnail?.[0]) formData.append("thumbnail", data.thumbnail[0]);

    let promise;
    if (video) {
      promise = dispatch(updateVideo({ videoId: video._id, data: formData }));
    } else {
      promise = dispatch(publishVideo({ data: formData }));
    }

    setUploadPromise(promise);
    dialogRef.current?.close();
    uploadingRef.current?.open();

    promise.then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        uploadingRef.current?.close();
        successRef.current?.open();
      } else {
        uploadingRef.current?.close();
      }
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Uploading & Success Modals */}
      <UploadingVideo
        ref={uploadingRef}
        abort={handleAbort}
        video={video || getValues()}
        updating={!!video}
      />
      <UploadSuccess
        ref={successRef}
        video={video || getValues()}
        updating={!!video}
      />

      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 w-full max-w-4xl rounded-2xl border-0 bg-transparent p-0 shadow-2xl open:flex open:items-center open:justify-center"
        onClose={() => setIsOpen(false)}
      >
        <div className="relative w-full max-h-[90vh] overflow-hidden rounded-2xl bg-gray-900/95 backdrop-blur-2xl ring-2 ring-blue-500/20">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-900/90 p-6 backdrop-blur-xl">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Film className="text-blue-400" size={32} />
                {video ? "Edit Video" : "Upload Video"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {video
                  ? "Update your video details"
                  : "Share your masterpiece with the world"}
              </p>
            </div>
            <button
              onClick={() => dialogRef.current?.close()}
              className="rounded-xl p-3 text-gray-400 transition hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close"
            >
              <X size={28} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto p-6"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              {/* LEFT SIDE */}
              <div className="space-y-6">
                {!video && (
                  <div>
                    <label className="mb-3 block text-lg font-semibold text-white">
                      <Upload
                        className="inline-block mr-2 text-blue-400"
                        size={20}
                      />
                      Video File <span className="text-red-400">*</span>
                    </label>
                    <label
                      htmlFor="videoFile"
                      className="block cursor-pointer rounded-2xl border-2 border-dashed border-gray-600 bg-gray-800/50 p-10 text-center transition-all hover:border-blue-500 hover:bg-gray-800"
                    >
                      <input
                        id="videoFile"
                        type="file"
                        accept="video/mp4,video/webm"
                        {...register("videoFile", {
                          required: !video,
                          validate: (files) => {
                            if (!files?.[0]) return true;
                            const valid = ["video/mp4", "video/webm"].includes(
                              files[0].type
                            );
                            return valid || "Only MP4 or WebM files allowed";
                          },
                        })}
                        className="sr-only"
                      />
                      {videoPreview ? (
                        <div className="space-y-4">
                          <video
                            src={videoPreview}
                            controls
                            className="mx-auto max-h-64 rounded-xl"
                          />
                          <p className="text-sm text-green-400 flex items-center justify-center gap-2">
                            <CheckCircle size={16} />
                            Ready to upload
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload size={56} className="mx-auto text-blue-400" />
                          <p className="text-lg font-medium text-white">
                            Drop your video here
                          </p>
                          <p className="text-sm text-gray-400">
                            or click to browse • Max 2GB • MP4/WebM
                          </p>
                        </div>
                      )}
                    </label>
                    {errors.videoFile && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.videoFile.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Thumbnail */}
                <div>
                  <label className="mb-3 block text-lg font-semibold text-white">
                    <Image
                      className="inline-block mr-2 text-blue-400"
                      size={20}
                    />
                    Thumbnail{" "}
                    {!video && <span className="text-red-400">*</span>}
                  </label>
                  <label
                    htmlFor="thumbnail"
                    className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/50 transition-all hover:border-blue-500"
                  >
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      {...register("thumbnail", {
                        required: !video,
                        validate: (files) => {
                          if (!files?.[0]) return true;
                          const valid = [
                            "image/jpeg",
                            "image/png",
                            "image/webp",
                          ].includes(files[0].type);
                          return valid || "Only JPG, PNG, WebP allowed";
                        },
                      })}
                      className="sr-only"
                    />
                    {thumbnailPreview ? (
                      <div className="relative aspect-video overflow-hidden rounded-xl">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                          <Upload className="text-white" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-12">
                        <Image size={48} className="text-blue-400" />
                        <p className="mt-3 text-white">
                          Click to upload thumbnail
                        </p>
                        <p className="text-xs text-gray-400">
                          1280x720 recommended
                        </p>
                      </div>
                    )}
                  </label>
                  {errors.thumbnail && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.thumbnail.message}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    <FileText className="inline-block mr-1" size={16} />
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    maxLength={100}
                    className="w-full rounded-xl border border-gray-600 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    placeholder="Enter an awesome title..."
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

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={6}
                    maxLength={5000}
                    className="w-full resize-none rounded-xl border border-gray-600 bg-gray-800/50 px-4 py-3 text-white 
                               placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    placeholder="Tell viewers what your video is about..."
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">
                    {watch("description")?.length || 0}/5000
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                    className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-6 py-4 font-medium text-gray-300 
                               transition hover:border-gray-500 hover:bg-gray-700 hover:text-white 
                               focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                    className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 
                               font-bold text-white transition hover:bg-blue-500 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                               focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload size={22} />
                    {video ? "Update Video" : "Publish Now"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>,
    document.getElementById("popup-models")
  );
});

export default VideoUploadForm;

import { getChannelVideos } from "@/app/Slices/dashboardSlice";
import { deleteVideo, togglePublishStatus } from "@/app/Slices/videoSlice";
import { formatDateFigure } from "@/utils/helpers/formatFigure";
import { Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ConfirmPopup from "../core/ConfirmPopup";
import VideoUploadForm from "./VideoUploadForm";
import DeletingVideo from "./DeleteVideo";

const AdminVideoLayout = ({ video }) => {
  const dispatch = useDispatch();
  const confirmDialog = useRef();
  const editDialog = useRef();
  const deleteDialog = useRef();
  const deletingModalRef = useRef();

  const [publishedStatus, setPublishedStatus] = useState(video.isPublished);

  const handleTogglePublish = () => {
    dispatch(togglePublishStatus(video?._id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setPublishedStatus((prev) => !prev);
      }
      dispatch(getChannelVideos());
    });
  };

  const handleDeleteVideo = async (isConfirm) => {
    if (!isConfirm) return;

    confirmDialog.current?.close();
    deletingModalRef.current?.open();

    try {
      await dispatch(deleteVideo(video?._id)).unwrap();
      dispatch(getChannelVideos());
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      deletingModalRef.current?.close();
    }
  };
  return (
    <tr key={video?._id} className="group border">
      {/* Toggle */}
      <td>
        <div className="flex justify-center">
          <label
            htmlFor={"vid-pub-" + video._id}
            className="relative inline-block w-12 cursor-pointer overflow-hidden"
          >
            <input
              type="checkbox"
              onChange={handleTogglePublish}
              id={"vid-pub-" + video._id}
              checked={publishedStatus}
              className="peer sr-only"
            />
            <span className="block h-6 w-full rounded-full bg-gray-300 transition-colors duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-indigo-500 peer-checked:after:translate-x-6"></span>
          </label>
        </div>
      </td>

      {/* Status Label */}
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <div className="flex justify-center">
          <span
            className={`inline-block rounded-2xl px-2 py-1 ${
              publishedStatus
                ? "border border-green-600 bg-green-100 text-green-800"
                : "border border-orange-600 bg-red-100 text-orange-800"
            }`}
          >
            {publishedStatus ? "Published" : "Unpublished"}
          </span>
        </div>
      </td>

      {/* Thumbnail + Title */}
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <div className="flex items-center gap-4">
          {publishedStatus ? (
            <Link
              to={`/watch/${video._id}`}
              className="flex items-center gap-2"
            >
              <img
                src={video?.thumbnail?.url}
                alt={video?.title}
                className="h-16 w-28 rounded-md object-cover"
              />
            </Link>
          ) : (
            <img
              src={video?.thumbnail?.url}
              alt={video?.title}
              className="h-16 w-28 rounded-md object-cover"
            />
          )}

          <h3 className="font-semibold">
            {publishedStatus ? (
              <Link to={`/watch/${video._id}`} className="hover:text-gray-300">
                {video.title?.length > 35
                  ? video.title.substring(0, 35) + "..."
                  : video.title}
              </Link>
            ) : video.title?.length > 35 ? (
              video.title.substring(0, 35) + "..."
            ) : (
              video.title
            )}
          </h3>
        </div>
      </td>

      {/* Date */}
      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {formatDateFigure(video.formattedDate)}
      </td>

      {/* Views */}
      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {video.views}
      </td>

      {/* Comments */}
      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {video.commentsCount || 0}
      </td>

      {/* Likes/Dislikes */}
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <div className="flex justify-center gap-4">
          <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
            {video.likesCount} likes
          </span>
          <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">
            {video.dislikesCount} dislikes
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        {/* Confirm Delete Popup */}
        <ConfirmPopup
          ref={confirmDialog}
          title="Permanently delete this video?"
          subtitle={`${video.title} - total views: ${video.views}`}
          confirm="Delete"
          cancel="Cancel"
          critical
          checkbox="I understand that deleting is permanent, and can't be undone"
          actionFunction={handleDeleteVideo}
        />

        {/* Edit Form */}
        <VideoUploadForm ref={editDialog} video={video} />

        {/* Delete video */}
        <DeletingVideo ref={deletingModalRef} video={video} />

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => confirmDialog.current?.open()}
            className="hover:text-red-500 transition"
            title="Delete video"
          >
            <Trash2 size={18} className="text-red-500" />
          </button>

          <button
            onClick={() => editDialog.current?.open()}
            className="hover:text-blue-500 transition"
            title="Edit video"
          >
            <MdEdit size={20} className="text-blue-500" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminVideoLayout;

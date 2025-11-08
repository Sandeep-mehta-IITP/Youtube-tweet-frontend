import { getChannelVideos } from "@/app/Slices/dashboardSlice";
import { togglePublishStatus } from "@/app/Slices/videoSlice";
import { formatDate } from "@/utils/helpers/formatFigure";
import { Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ConfirmPopup from "../core/ConfirmPopup";

const AdminVideoLayout = ({ video }) => {
  const dispatch = useDispatch();
  const confirmDialog = useRef();
  const editDialog = useRef();

  console.log("video in admin video layout", video);
  

  const [publishedStatus, setPublishedStatus] = useState(video.isPublished);

  const handleTogglePublish = () => {
    dispatch(togglePublishStatus(video?._id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setPublishedStatus((prev) => !prev);
      }
      dispatch(getChannelVideos());
    });
  };

  const handleDeleteVideo = (isConfirm) => {
    if (isConfirm) {
      dispatch(deleteVideo(video?._id));
      dispatch(getChannelVideos());
    }
  };
  return (
    <tr key={video?._id} className="group border">
      {/* Publish-Unpublished toggle box */}
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
              defaultChecked={publishedStatus}
              className="peer sr-only"
            />
            <span
              className="
      block h-6 w-full rounded-full bg-gray-300 transition-colors duration-300
      after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all
      peer-checked:bg-indigo-500 peer-checked:after:translate-x-6
    "
            ></span>
          </label>
        </div>
      </td>
      {/* Publish-Unpublished label */}
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <div className="flex justify-center">
          <span
            className={`inline-block rounded-2xl px-2 py-1 ${publishedStatus ? "border border-green-600 bg-green-100 text-green-800" : "border border-orange-600 bg-red-100 text-orange-800"}`}
          >
            {publishedStatus ? "Published" : "Unpublished"}
          </span>
        </div>
      </td>

      {/* Thumbnail  and title*/}
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <div className="flex items-center gap-4">
          {publishedStatus ? (
            <Link
              to={`/video/${video._id}`}
              className="flex items-center gap-2"
            >
              <img
                src={video?.thumbnail?.url}
                alt={video?.title}
                className="h-16 w-28 rounded-md"
              />
            </Link>
          ) : (
            <img
              src={video?.thumbnail?.url}
              alt={video?.title}
              className="h-16 w-28 rounded-md"
            />
          )}

          <h3 className="font-semibold">
            {publishedStatus ? (
              <Link to={`/watch/${video._id}`} className="hover:text-gray-300">
                {video.title?.length > 35
                  ? video.title.substr(0, 35) + "..."
                  : video.title}
              </Link>
            ) : video.title?.length > 35 ? (
              video.title.substr(0, 35) + "..."
            ) : (
              video.title
            )}
          </h3>
        </div>
      </td>

      {/* Upload date */}
      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {formatDate(video.createdAt)}
      </td>

      {/* Views */}
      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {video.views}
      </td>

      {/* Comments Count */}
      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {video.commentsCount}
      </td>

      {/* Like-Dislike Count */}
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

      {/* Video Manipulation*/}
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <ConfirmPopup
          title={"Permanently delete this video?"}
          subtitle={`${video.title} - total views: ${video.views}`}
          confirm="Delete"
          cancel="Cancel"
          critical
          checkbox="I understand that deleting is permanent, and can't be undone"
          ref={confirmDialog}
          actionFunction={handleDeleteVideo}
        />
        {/* <UploadVideo ref={editDialog} video={video} /> */}
        <div className="flex gap-4">
          {/* Delete Button */}
          <button
            onClick={() => confirmDialog.current?.open()}
            className="h-5 w-5 hover:text-red-500"
          >
            <Trash2 size={14} className="text-red-500 font-bold" />
          </button>
          {/* Edit Button */}
          <button
            onClick={() => editDialog.current?.open()}
            className="h-5 w-5 hover:text-[#3b82f6]"
          >
            <MdEdit size={16} className="text-blue-500 font-bold" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminVideoLayout;

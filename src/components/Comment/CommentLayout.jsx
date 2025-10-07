import {
  deleteComment,
  getVideoComments,
  updateComment,
} from "@/app/Slices/commentSlice";
import { formatTimestamp } from "@/utils/helpers/formatFigure";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LikeComponent from "../core/LikeComponent";
import { Heart } from "lucide-react";

const CommentLayout = ({ comment, videoId, ownerAvatar = "" }) => {
  const [isEditing, setIsEditng] = useState(false);
  const [content, setContent] = useState(comment?.content);
  const inputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleChancel = () => {
    setIsEditng(false);
    setContent(comment?.content);
  };

  const handleEditing = () => {
    setIsEditng(true);
  };

  const handleUpdate = () => {
    if (!content.trim()) {
      toast.warn("Please enter some content.");
      return;
    }

    dispatch(updateComment({ commentId: comment._id, data: { content } }));
    setIsEditng(false);
  };

  const handleDelete = () => {
    useDispatch(deleteComment({ commentId: comment._id })).then(() => {
      dispatch(getVideoComments(videoId));
    });
  };

  return (
    <section className="flex justify-between">
      {/* Comment content */}
      <span className="flex w-full gap-x-5">
        {/* Avatar */}
        <div className="mt-2 w-11 h-11 shrink-0 border-white">
          <Link to={`/user/${comment?.owner?.username}`}>
            <img
              src={comment.owner.avatar}
              alt={comment.owner.username}
              className="w-full h-full object-cover rounded-full"
            />
          </Link>
        </div>
        {/* Content */}
        <div className="block w-full">
          <p className="flex items-center text-gray-200 text-sm">
            {comment.owner?.fullName}{" "}
            <span className="text-xs">
              {formatTimestamp(comment.createdAt)}
            </span>
          </p>
          <p className="text-xs text-gray-200">
            <Link to={`/user/${comment?.owner?.username}`}>
              @{comment?.owner?.username}
            </Link>
          </p>

          <p className="my-2 text-sm">
            <input
              type="text"
              ref={inputRef}
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!comment.owner || !isEditing}
              className="w-[72%] bg-transparent outline-none border-b-[1px] border-transparent enabled:border-blue-500 focus:border-blue-500"
            />
          </p>

          {/* Likes Component */}
          <span
            className={`flex items-center overflow-hidden rounded-lg max-w-fit h-fit text-xs relative`}
          >
            <LikeComponent
              commentId={comment._id}
              isLiked={comment.isLiked}
              totalLikes={comment.likesCount}
              isDisLiked={comment.isDisLiked}
              totalDisLikes={comment.disLikesCount}
            />

            {/* Likedby user detials */}
            {comment.isLikedByVideoOwner && (
              <div className="w-fit flex items-center justify-center border border-transparent rounded-lg ml-1 hover:border-slate-300">
                <Link to={`/watch/${videoId}`}>
                  <img
                    src={ownerAvatar}
                    alt={ownerAvatar}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="inline-block w-4 absolute bottom-0 right-0">
                    <Heart className="w-3 h-3 fill-red-600" />
                  </span>
                </Link>
              </div>
            )}
          </span>
        </div>
      </span>

      {/* Comment controls - only for owner */}
      {comment.isOwner && (
        <form className="flex items-end">
          <span className="flex justify-end">
            {/* Delete and Cancel button */}
            <button
              type="button"
              onClick={() => {
                isEditing ? handleChancel : handleDelete;
              }}
              className={`pt-0 rounded-3xl bg-transparent hover:border hover:border-b-white disabled:cursor-not-allowed px-2 pb-1 mr-2 text-white text-sm font-semibold ${
                isEditing
                  ? "hover:bg-gray-600"
                  : "hover: bg-red-500 hover:text-black"
              }`}
            >
              {isEditing ? "Cancel" : "Delete"}
            </button>

            {/* Edit and Update button */}
            <button
              type="button"
              onClick={() => {
                isEditing ? handleUpdate : handleEditing;
              }}
              className={`pt-0 rounded-3xl bg-blue-400 disabled:bg-gray-700 disabled:text-white disabled:cursor-not-allowed hover:bg-blue-500 px-2 pb-1 text-black text-sm font-semibold border border-b-white`}
            >
              {isEditing ? "Update" : "Edit"}
            </button>
          </span>
        </form>
      )}
    </section>
  );
};

export default CommentLayout;

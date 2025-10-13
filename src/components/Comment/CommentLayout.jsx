import { updateComment, deleteComment } from "@/app/Slices/commentSlice";
import { formatTimestamp } from "@/utils/helpers/formatFigure";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LikeComponent from "../core/LikeComponent";

const CommentLayout = ({
  comment,
  videoId,
  ownerAvatar = "",
  updateCommentLocally,
  deleteCommentLocally,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment?.content);
  const inputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditing) inputRef.current.focus();
  }, [isEditing]);

  const handleCancel = () => {
    setIsEditing(false);
    setContent(comment?.content);
  };

  const handleEditing = () => setIsEditing(true);

  const handleUpdate = async () => {
    if (!content.trim()) return toast.warn("Please enter some content.");

    try {
      // Optimistic UI: update parent state immediately
      updateCommentLocally({ ...comment, content });
      setIsEditing(false);

      // Dispatch backend update
      await dispatch(
        updateComment({ commentId: comment._id, content })
      ).unwrap();
    } catch (err) {
      setContent(comment?.content); // revert on failure
      updateCommentLocally(comment);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      // Optimistic UI: remove immediately
      deleteCommentLocally(comment._id);

      // Dispatch backend delete
      await dispatch(deleteComment({ commentId: comment._id })).unwrap();
    } catch (err) {
      // Optionally, re-add the comment if deletion fails
      updateCommentLocally(comment);
    }
  };

  return (
    <section className="flex justify-between">
      {/* Comment content */}
      <span className="flex w-full gap-x-5">
        {/* Avatar */}
        <div className="mt-2 w-11 h-11 shrink-0 border-white">
          <Link to={`/user/${comment?.owner?.username}`}>
            <img
              src={comment?.owner?.avatar}
              alt={comment?.owner?.username}
              className="w-full h-full object-cover rounded-full"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="block w-full">
          <p className="flex items-center text-gray-200 gap-x-3 text-sm font-semibold">
            <Link to={`/user/${comment?.owner?.username}`}>
              @{comment?.owner?.username}
            </Link>
            <span className="text-sm font-normal opacity-60 hover:opacity-100">
              {formatTimestamp(comment?.createdAt)}
            </span>
          </p>

          <p className="my-2 text-sm">
            <input
              type="text"
              ref={inputRef}
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!comment.isOwner || !isEditing}
              className="w-[72%] bg-transparent outline-none border-b-[1px] border-transparent enabled:border-blue-500 focus:border-blue-500"
            />
          </p>

          {/* Likes Component */}
          <span className="flex items-center overflow-hidden rounded-lg max-w-fit h-fit text-xs relative">
            <LikeComponent
              commentId={comment._id}
              isLiked={comment.isLiked}
              totalLikes={comment.likesCount}
              isDisLiked={comment.isDisLiked}
              totalDisLikes={comment.disLikesCount}
            />

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
        <div className="flex items-end">
          <button
            type="button"
            onClick={isEditing ? handleCancel : handleDelete}
            className={`pt-0 rounded-3xl bg-transparent hover:border hover:border-b-white px-2 pb-1 mr-2 text-white text-sm font-semibold ${
              isEditing
                ? "hover:bg-gray-600 hover:text-white"
                : "hover:bg-red-500 hover:text-white"
            }`}
          >
            {isEditing ? "Cancel" : "Delete"}
          </button>

          <button
            type="button"
            onClick={isEditing ? handleUpdate : handleEditing}
            className="pt-0 rounded-3xl bg-blue-400 hover:bg-blue-500 px-2 pb-1 text-black text-sm font-semibold hover:border hover:border-b-white"
          >
            {isEditing ? "Update" : "Edit"}
          </button>
        </div>
      )}
    </section>
  );
};

export default CommentLayout;

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
  const [content, setContent] = useState(comment?.content || "");
  const textareaRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [isEditing]);

  const handleCancel = () => {
    setIsEditing(false);
    setContent(comment?.content || "");
  };

  const handleEditing = () => setIsEditing(true);

  const handleUpdate = async () => {
    if (!content.trim()) {
      toast.warn("Please enter some content.");
      return;
    }

    try {
      // Optimistic UI: update parent state immediately
      updateCommentLocally({ ...comment, content });
      setIsEditing(false);

      // Dispatch backend update
      await dispatch(
        updateComment({ commentId: comment._id, content })
      ).unwrap();
      toast.success("Comment updated successfully");
    } catch (err) {
      toast.error("Failed to update comment");
      console.log(err);
      
      setContent(comment?.content || "");
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
      toast.success("Comment deleted successfully");
    } catch (err) {
      toast.error("Failed to delete comment");
      console.log(err);
      
      updateCommentLocally(comment);
    }
  };

  return (
    <section className="flex flex-col sm:flex-row justify-between gap-4">
      {/* Comment content */}
      <div className="flex w-full gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="mt-2 w-10 h-10 sm:w-12 sm:h-12 shrink-0">
          <Link to={`/user/${comment?.owner?.username}`}>
            <img
              src={comment?.owner?.avatar || "/default-avatar.png"}
              alt={`${comment?.owner?.username}'s avatar`}
              className="w-full h-full object-cover rounded-full border border-gray-200 dark:border-gray-700"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <Link
              to={`/user/${comment?.owner?.username}`}
              className="text-gray-900 dark:text-white font-semibold hover:underline"
            >
              @{comment?.owner?.username}
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {formatTimestamp(comment?.createdAt)}
            </span>
          </div>

          <div className="my-2 text-sm text-gray-900 dark:text-white">
            {isEditing ? (
              <textarea
                ref={textareaRef}
                name="content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  const el = textareaRef.current;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
                disabled={!comment.isOwner}
                placeholder="Edit your comment..."
                className="w-full resize-none bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors py-1"
                aria-label="Edit comment"
              />
            ) : (
              <p>{comment?.content}</p>
            )}
          </div>

          {/* Likes Component */}
          <div className="flex items-center gap-2">
            <LikeComponent
              commentId={comment._id}
              isLiked={comment.isLiked}
              totalLikes={comment.likesCount}
              isDisLiked={comment.isDisLiked}
              totalDisLikes={comment.disLikesCount}
            />
            {comment.isLikedByVideoOwner && (
              <div className="relative flex items-center justify-center">
                <Link to={`/watch/${videoId}`}>
                  <img
                    src={ownerAvatar || "/default-avatar.png"}
                    alt="Video owner's avatar"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200 dark:border-gray-700"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-600 rounded-full border border-white dark:border-gray-800" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment controls - only for owner */}
      {comment.isOwner && (
        <div className="flex items-center sm:items-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={isEditing ? handleCancel : handleDelete}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition transform active:scale-95 ${
              isEditing
                ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                : "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
            }`}
            aria-label={isEditing ? "Cancel editing" : "Delete comment"}
          >
            {isEditing ? "Cancel" : "Delete"}
          </button>
          <button
            type="button"
            onClick={isEditing ? handleUpdate : handleEditing}
            className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition transform active:scale-95"
            aria-label={isEditing ? "Update comment" : "Edit comment"}
          >
            {isEditing ? "Update" : "Edit"}
          </button>
        </div>
      )}
    </section>
  );
};

export default CommentLayout;

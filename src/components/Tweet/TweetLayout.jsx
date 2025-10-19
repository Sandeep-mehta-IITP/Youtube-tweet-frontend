import { deleteTweet, updateTweet } from "@/app/Slices/tweetSlice";
import { formatTimestamp } from "@/utils/helpers/formatFigure";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LikeComponent from "../core/LikeComponent";

const TweetLayout = ({ tweet, owner, authStatus }) => {
  const dispatch = useDispatch();
  const textareaRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(tweet?.content);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [isEditing]);

  const handleCancel = () => {
    setIsEditing(false);
    setContent(tweet?.content || "");
  };

  const handleEditing = () => setIsEditing(true);

  const handleUpdate = async () => {
    if (!content.trim()) {
      toast.warn("Please enter some content.");
      return;
    } else if (content.trim()?.length < 20) {
      toast.error("Minimum 20 characters are required");
      return;
    } else if (content.trim()?.length > 700) {
      toast.error("Maximum 700 characters are allowed");
      return;
    }

    try {
      await dispatch(updateTweet({ tweetId: tweet?._id, content })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) {
      return;
    }

    try {
      await dispatch(deleteTweet({ tweetId: tweet?._id })).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <li>
      <section className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Tweet content */}
        <div className="flex w-full gap-3 sm:gap-4">
          {/* Avatar */}
          <div className="mt-2 w-10 h-10 sm:w-12 sm:h-12 shrink-0">
            <Link to={`/user/${tweet?.owner?.username}`}>
              <img
                src={tweet?.owner?.avatar || "/default-avatar.png"}
                alt={`${tweet?.owner?.username}'s avatar`}
                className="w-full h-full object-cover rounded-full border border-gray-200 dark:border-gray-700"
              />
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 text-sm">
              <Link
                to={`/user/${tweet?.owner?.username}`}
                className="text-gray-900 dark:text-white font-semibold hover:underline"
              >
                @{tweet?.owner?.username}
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {formatTimestamp(tweet?.createdAt)}
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
                  disabled={!tweet.isOwner}
                  placeholder="Edit your tweet..."
                  className="w-full resize-none bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors py-1"
                  aria-label="Edit tweet"
                />
              ) : (
                <p>{tweet?.content}</p>
              )}
            </div>

            {/* Likes Component */}
            <div className="flex items-center gap-2">
              <LikeComponent
                commentId={tweet?._id}
                isLiked={tweet?.isLiked}
                totalLikes={tweet?.likesCount}
                isDisLiked={tweet?.isDisLiked}
                totalDisLikes={tweet?.disLikesCount}
              />
            </div>
          </div>
        </div>

        {/* Comment controls - only for owner */}
        {tweet?.isOwner && (
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
    </li>
  );
};

export default TweetLayout;

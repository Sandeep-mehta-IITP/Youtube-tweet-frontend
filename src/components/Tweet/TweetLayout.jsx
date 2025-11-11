import {
  deleteTweet,
  getAllTweets,
  updateTweet,
} from "@/app/Slices/tweetSlice";
import { formatTimestamp } from "@/utils/helpers/formatFigure";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LikeComponent from "../core/LikeComponent";
import { Edit2, Trash2, Check, X, Loader2, MoreHorizontal } from "lucide-react";

const TweetLayout = ({ tweet, owner }) => {
  //console.log("tweet in tweetlayout", tweet);
  
  const dispatch = useDispatch();
  const textareaRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(tweet?.content || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Sync content on refresh
  useEffect(() => {
    setContent(tweet?.content || "");
  }, [tweet?.content]);

  // Auto resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
      textareaRef.current?.focus();
    }
  }, [isEditing, adjustTextareaHeight]);

  // Cancel edit
  const handleCancel = () => {
    setContent(tweet?.content || "");
    setIsEditing(false);
  };

  // Update tweet
  const handleUpdate = async () => {
    const trimmed = content.trim();
    if (!trimmed) return toast.warn("Tweet cannot be empty");
    if (trimmed.length < 20) return toast.error("Minimum 20 characters");
    if (trimmed.length > 700) return toast.error("Maximum 700 characters");

    setIsUpdating(true);
    try {
      await dispatch(
        updateTweet({ tweetId: tweet._id, content: trimmed })
      ).unwrap();
      setIsEditing(false);
      await dispatch(getAllTweets()).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete tweet
  const handleDelete = async () => {
    if (!window.confirm("Delete this tweet permanently?")) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteTweet(tweet._id)).unwrap();
      setIsDeleting(false);
    } catch {
      setIsDeleting(false);
    }
  };

  // Deletion skeleton
  if (isDeleting) {
    return (
      <li className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl animate-pulse">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/4 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 w-3/4 rounded"></div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li key={tweet?._id} className="group transition-all duration-300">
      <article className="flex gap-4 p-4 bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-700">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Link to={`/user/${tweet?.ownerDetails?.username}`}>
            <img
              src={tweet?.ownerDetails?.avatar || "/default-avatar.png"}
              alt={tweet?.ownerDetails?.username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-blue-500 transition-all"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/user/${tweet?.ownerDetails?.username}`}
                className="font-semibold text-gray-900 dark:text-white hover:underline"
              >
                @{tweet?.ownerDetails?.username}
              </Link>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(tweet?.createdAt)}
              </div>
            </div>

            {/* Menu Button */}
            {(owner || tweet?.isOwner) && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden"
                    onMouseLeave={() => setShowMenu(false)}
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tweet Text */}
          <div className="mt-2 text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    adjustTextareaHeight();
                  }}
                  placeholder="What's on your mind?"
                  className="w-full min-h-[60px] max-h-[160px] resize-none bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`${
                      content.trim().length < 20 || content.trim().length > 700
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {content.trim().length}/700
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={
                        isUpdating ||
                        content.trim().length < 20 ||
                        content.trim().length > 700
                      }
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p>{tweet?.content}</p>
            )}
          </div>

          {/* Footer (Likes, etc.) */}
          <div className="mt-4 flex justify-between items-center">
            <LikeComponent
              tweetId={tweet?._id}
              isLiked={tweet?.isLiked}
              totalLikes={tweet?.totalLikes}
              isDisLiked={tweet?.isDisLiked}
              totalDisLikes={tweet?.totalDislikes}
            />
          </div>
        </div>
      </article>
    </li>
  );
};

export default TweetLayout;

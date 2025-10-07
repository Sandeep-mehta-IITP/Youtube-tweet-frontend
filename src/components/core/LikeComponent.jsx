import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginPopup from "../auth/LoginPopup";
import { ThumbsDown, ThumbsUp, Loader2 } from "lucide-react";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "@/app/Slices/likeSlice";

const LikeComponent = ({
  videoId,
  commentId,
  tweetId,
  isLiked = false,
  totalLikes = 0,
  isDisliked = false,
  totalDislikes = 0,
}) => {
  const dispatch = useDispatch();
  const loginPopupRef = useRef();
  const { isAuthenticated } = useSelector(({ auth }) => auth);
  const [isLoading, setIsLoading] = useState(false);
  const [localLikes, setLocalLikes] = useState(totalLikes);
  const [localDislikes, setLocalDislikes] = useState(totalDislikes);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localIsDisliked, setLocalIsDisliked] = useState(isDisliked);

  const handleToggleLike = async (likeStatus) => {
    if (!isAuthenticated) {
      loginPopupRef.current.open();
      return;
    }

    if (!videoId && !commentId && !tweetId) {
      toast.error("Invalid action: No resource ID provided.");
      return;
    }

    setIsLoading(true);
    // Optimistically update local state for immediate feedback
    if (likeStatus) {
      if (localIsDisliked) {
        setLocalIsDisliked(false);
        setLocalDislikes((prev) => prev - 1);
        setLocalIsLiked(true);
        setLocalLikes((prev) => prev + 1);
      } else if (localIsLiked) {
        setLocalIsLiked(false);
        setLocalLikes((prev) => prev - 1);
      } else {
        setLocalIsLiked(true);
        setLocalLikes((prev) => prev + 1);
      }
    } else {
      if (localIsLiked) {
        setLocalIsLiked(false);
        setLocalLikes((prev) => prev - 1);
        setLocalIsDisliked(true);
        setLocalDislikes((prev) => prev + 1);
      } else if (localIsDisliked) {
        setLocalIsDisliked(false);
        setLocalDislikes((prev) => prev - 1);
      } else {
        setLocalIsDisliked(true);
        setLocalDislikes((prev) => prev + 1);
      }
    }

    try {
      let action;
      if (videoId) {
        action = toggleVideoLike({ videoId, toggleLike: likeStatus });
      } else if (commentId) {
        action = toggleCommentLike({ commentId, toggleLike: likeStatus });
      } else if (tweetId) {
        action = toggleTweetLike({ tweetId, toggleLike: likeStatus });
      }

      await dispatch(action).unwrap();
      // If the API returns updated counts, you can update local state here
      // For now, rely on parent component to pass updated props
    } catch (error) {
      // Revert optimistic updates on error
      setLocalIsLiked(isLiked);
      setLocalLikes(totalLikes);
      setLocalIsDisliked(isDisliked);
      setLocalDislikes(totalDislikes);
      toast.error(
        error.message || "Failed to update like status. Please try again."
      );
      console.error("Like toggle error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-1 bg-gray-800 rounded-full p-1 ${
        videoId ? "px-2 py-1" : "px-1.5 py-0.5"
      }`}
    >
      <LoginPopup
        ref={loginPopupRef}
        message={`Sign in to ${
          videoId
            ? "like this video"
            : commentId
              ? "like this comment"
              : "like this tweet"
        }...`}
      />
      {/* Like Button */}
      <button
        onClick={() => handleToggleLike(true)}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-700 transition-colors ${
          localIsLiked ? "text-blue-400" : "text-gray-300"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading && !localIsDisliked ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ThumbsUp
            className={`w-4 h-4 ${localIsLiked ? "fill-blue-400" : ""}`}
          />
        )}
        <span className="text-xs">{localLikes}</span>
      </button>
      {/* Dislike Button */}
      <button
        onClick={() => handleToggleLike(false)}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-700 transition-colors ${
          localIsDisliked ? "text-blue-400" : "text-gray-300"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading && !localIsLiked ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ThumbsDown
            className={`w-4 h-4 ${localIsDisliked ? "fill-blue-400" : ""}`}
          />
        )}
        <span className="text-xs">{localDislikes}</span>
      </button>
    </div>
  );
};

export default LikeComponent;

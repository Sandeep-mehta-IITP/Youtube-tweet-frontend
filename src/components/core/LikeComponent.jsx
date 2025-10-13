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
  isDisLiked = false,
  totalDisLikes = 0,
}) => {
  const dispatch = useDispatch();
  const loginPopupRef = useRef();
  const { isAuthenticated } = useSelector(({ auth }) => auth);

  const [isLoading, setIsLoading] = useState(false);
  const [localLikes, setLocalLikes] = useState(totalLikes);
  const [localDislikes, setLocalDislikes] = useState(totalDisLikes);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localIsDisliked, setLocalIsDisliked] = useState(isDisLiked);

  const handleToggleLike = async (likeStatus) => {
    if (!isAuthenticated) return loginPopupRef.current.open();

    if (!videoId && !commentId && !tweetId) {
      toast.error("Invalid action: No resource ID provided.");
      return;
    }

    setIsLoading(true);

    // Optimistic UI update
    let newIsLiked = localIsLiked;
    let newIsDisliked = localIsDisliked;
    let newLikes = localLikes;
    let newDislikes = localDislikes;

    if (likeStatus) {
      // User clicked LIKE
      if (localIsLiked) {
        newIsLiked = false;
        newLikes--;
      } else {
        newIsLiked = true;
        newLikes++;
        if (localIsDisliked) {
          newIsDisliked = false;
          newDislikes--;
        }
      }
    } else {
      // User clicked DISLIKE
      if (localIsDisliked) {
        newIsDisliked = false;
        newDislikes--;
      } else {
        newIsDisliked = true;
        newDislikes++;
        if (localIsLiked) {
          newIsLiked = false;
          newLikes--;
        }
      }
    }

    // Apply optimistic changes
    setLocalIsLiked(newIsLiked);
    setLocalIsDisliked(newIsDisliked);
    setLocalLikes(newLikes);
    setLocalDislikes(newDislikes);

    try {
      let action;
      if (videoId)
        action = toggleVideoLike({ videoId, toggleLike: likeStatus });
      else if (commentId)
        action = toggleCommentLike({ commentId, toggleLike: likeStatus });
      else if (tweetId)
        action = toggleTweetLike({ tweetId, toggleLike: likeStatus });

      const response = await dispatch(action).unwrap();

      // Sync UI with backend (authoritative counts)
      setLocalLikes(response.totalLikes);
      setLocalDislikes(response.totalDisLikes);
      setLocalIsLiked(response.isLiked);
      setLocalIsDisliked(response.isDisLiked);
    } catch (err) {
      // Revert optimistic UI if failed
      setLocalIsLiked(isLiked);
      setLocalIsDisliked(isDisLiked);
      setLocalLikes(totalLikes);
      setLocalDislikes(totalDisLikes);
      toast.error(err.message || "Failed to update like status.");
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

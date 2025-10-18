import { toggleCommentLike } from "@/app/Slices/likeSlice";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const CommentLike = ({
  commentId,
  isLiked = false,
  totalLikes = 0,
  isDisLiked = false,
  totalDisLikes = 0,
}) => {
  const [like, setLike] = useState({ isLiked, totalLikes });
  const [disLike, setDisLike] = useState({ isDisLiked, totalDisLikes });
  const dispatch = useDispatch();

  const toggleLike = (isLikeAction) => {
    // Optimistic update
    if (isLikeAction) {
      setLike({
        isLiked: !like.isLiked,
        totalLikes: like.isLiked ? like.totalLikes - 1 : like.totalLikes + 1,
      });
      if (disLike.isDisLiked) {
        setDisLike({
          isDisLiked: false,
          totalDisLikes: disLike.totalDisLikes - 1,
        });
      }
    } else {
      setDisLike({
        isDisLiked: !disLike.isDisLiked,
        totalDisLikes: disLike.isDisLiked
          ? disLike.totalDisLikes - 1
          : disLike.totalDisLikes + 1,
      });
      if (like.isLiked) {
        setLike({ isLiked: false, totalLikes: like.totalLikes - 1 });
      }
    }

    // Dispatch action to server
    dispatch(toggleCommentLike({ commentId, toggleLike: isLikeAction })).then(
      (res) => {
        if (res.payload) {
          const { isLiked, totalLikes, isDisLiked, totalDisLikes } =
            res.payload;
          setLike({ isLiked, totalLikes });
          setDisLike({ isDisLiked, totalDisLikes });
        } else {
          // Revert optimistic update on failure
          setLike({ isLiked, totalLikes });
          setDisLike({ isDisLiked, totalDisLikes });
        }
      }
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* Like button */}
      <button
        onClick={() => toggleLike(true)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition transform active:scale-95 ${
          like.isLiked
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
        }`}
        aria-label={`Like comment (${like.totalLikes} likes)`}
        aria-pressed={like.isLiked}
      >
        <ThumbsUp
          className={`w-4 h-4 ${like.isLiked ? "fill-blue-600 dark:fill-blue-400" : "fill-none"}`}
        />
        <span className="text-sm font-medium">{like.totalLikes}</span>
      </button>

      {/* Dislike button */}
      <button
        onClick={() => toggleLike(false)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition transform active:scale-95 ${
          disLike.isDisLiked
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
        }`}
        aria-label={`Dislike comment (${disLike.totalDisLikes} dislikes)`}
        aria-pressed={disLike.isDisLiked}
      >
        <ThumbsDown
          className={`w-4 h-4 ${disLike.isDisLiked ? "fill-blue-600 dark:fill-blue-400" : "fill-none"}`}
        />
        <span className="text-sm font-medium">{disLike.totalDisLikes}</span>
      </button>
    </div>
  );
};

export default CommentLike;

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
  const [DisLike, setDisLike] = useState({ isDisLiked, totalDisLikes });
  const dispatch = useDispatch();

  const toggleLike = (toggleLike) => {
    dispatch(toggleCommentLike({ commentId, toggleLike })).then((res) => {
      if (res.payload) {
        let { isLiked, totalLikes, isDisLiked, totalDisLikes } = res.payload;
        setLike(isLiked, totalLikes);
        setDisLike(isDisLiked, totalDisLikes);
      }
    });
  };
  return (
    <>
      {/* Like button */}
      <button
        onClick={() => toggleLike(true)}
        className={`flex items-center border-r border-gray-700 gap-x-2 px-2 py-[3px] after:content-[attr(data-like)] hover:bg-white/10 `}
        data-like={like?.totalLikes}
        data-like-alt={like?.totalLikes + 1}
      >
        <span
          className={`inline-block w-4 ${like?.isLiked ? "btn:text-[#AAACDE]" : "btn:text-white"} `}
        >
          <ThumbsUp
            className={`w-4 h-4 ${like?.isLiked ? "fill-blue-600" : "none"}`}
          />
        </span>
      </button>

      {/* Dislike button */}
      <button
        onClick={() => toggleLike(false)}
        className={`flex items-center border-r border-gray-700 gap-x-2 px-2 py-[3px] after:content-[attr(data-like)] hover:bg-white/10 `}
        data-like={DisLike?.totalDisLikes}
        data-like-alt={DisLike?.totalDisLikes + 1}
      >
        <span
          className={`inline-block w-4 ${DisLike?.isDisLiked ? "btn:text-[#AAACDE]" : "btn:text-white"} `}
        >
          <ThumbsDown
            className={`w-4 h-4 ${DisLike?.isDisLiked ? "fill-blue-600" : "none"}`}
          />
        </span>
      </button>
    </>
  );
};

export default CommentLike;

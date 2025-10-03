import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginPopup from "../auth/LoginPopup";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const LikeComponent = ({
  videoId,
  commentId,
  tweetId,
  isLiked = false,
  totalLikes = 0,
  isDisLiked = false,
  totalDisLikes = 0,
}) => {
  const [like, setLike] = useState({ isLiked, totalLikes });
  const [disLike, setDisLike] = useState({ isDisLiked, totalDisLikes });
  const dispatch = useDispatch();
  const loginPopupRef = useRef();

  const { isAuthenticated } = useSelector(({ auth }) => auth);

  const handleToggleLike = (status) => {
    if (!isAuthenticated) return loginPopupRef.current.open();

    let localLike = like.isLiked,
      localDislike = disLike.isDisLiked,
      localTotalLike = like.totalLikes,
      localTotalDisLike = disLike.totalDisLikes;

    if (status) {
      if (disLike.isDisLiked) {
        localLike = true;
          localTotalLike = like.totalLikes + 1;
          localDislike = false;
          localTotalDisLike = disLike.totalDisLikes - 1;
      } else if (like.isLiked) {
        localLike = false;
         localTotalLike = like.totalLikes - 1;
      } else {
        localLike = true;
        localTotalLike = like.totalLikes + 1;
      }
    } else {
      if (like.isLiked) {
        localLike = false;
        localTotalLike = like.totalLikes - 1;
        localDislike = true;
        localTotalDisLike = disLike.totalDisLikes + 1;
      } else if (disLike.isDisLiked) {
        localDislike = false;
        localTotalDisLike = disLike.totalDisLikes - 1;
      } else {
        localDislike = true;
        localTotalDisLike = disLike.totalDisLikes + 1;
      }
    }

    setLike((prev) => ({
      ...prev,
      isLiked: localLike,
      totalLikes: localTotalLike,
    }));
    setDisLike((prev) => ({
      ...prev,
      isDisLiked: localDislike,
      totalDisLikes: localTotalDisLike,
    }));
  };

  let qs = ""; // queryString
  if (videoId) qs = `videoId=${videoId}`;
  else if (commentId) qs = `commentId=${commentId}`;
  else if (tweetId) qs = `tweetId=${tweetId}`;
  else return toast.error("No ID found.");

  dispatch({ qs, toggleLike: status });
  return (
    <section
      className={`flex overflow-hidden bg-slate-800 rounded-lg border ${
        videoId ? "" : "max-w-fit h-fit text-sm"
      }`}
    >
      <LoginPopup ref={loginPopupRef} message="Sign in to Like Video..." />
      {/* Like button */}
      <button
        className={`flex items-center border-r border-gray-700 gap-x-3 ${
          videoId ? "px-4 py-1.5" : "px-2 py-1"
        } after:content-[attr(data-like)] hover:bg-white/10`}
        data-like={like?.totalLikes}
        data-like-alt={like?.totalLikes + 1}
        onClick={() => handleToggleLike(true)}
      >
        <span
          className={`inline-block ${videoId ? "w-5" : "w-4"} ${like.isLiked ? "btn:text-[#AEBDEA]" : "btn:text-white"}`}
        >
          <ThumbsUp
            className={`w-5 h-5 ${like.isLiked ? "text-[#AEBDEA]" : "none"}`}
          />
        </span>
      </button>

      {/* Dislike button */}
      <button
        className={`flex items-center border-r border-gray-700 gap-x-3 ${
          videoId ? "px-4 py-1.5" : "px-2 py-1"
        } after:content-[attr(data-like)] hover:bg-white/10`}
        data-like={disLike?.totalDisLikes}
        data-like-alt={disLike?.totalDisLikes + 1}
        onClick={() => handleToggleLike(false)}
      >
        <span
          className={`inline-block ${videoId ? "w-5" : "w-4"} ${like.isLiked ? "btn:text-[#AEBDEA]" : "btn:text-white"}`}
        >
          <ThumbsDown
            className={`w-5 h-5 ${like.isLiked ? "text-[#AEBDEA]" : "none"}`}
          />
        </span>
      </button>
    </section>
  );
};

export default LikeComponent;

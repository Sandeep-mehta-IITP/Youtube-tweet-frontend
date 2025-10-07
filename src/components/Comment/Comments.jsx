import { addComment, getVideoComments } from "@/app/Slices/commentSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginPopup from "../auth/LoginPopup";
import CommentLayout from "./CommentLayout";

const Comments = ({ videoId, ownerAvatar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const loginPopupRef = useRef();

  const { isAuthenticated } = useSelector(({ auth }) => auth);

  const { status, data } = useSelector((state) => state.comment);
  const [localCommentData, setLocalCommentData] = useState(null);

  useEffect(() => {
    if (!videoId) return;

    dispatch(getVideoComments(videoId)).then((res) => {
      setLocalCommentData(res.payload);
    });
  }, [videoId, navigate, dispatch]);

  const addCommentHandler = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return loginPopupRef.current.open();
    }

    const content = e.target.content.value;
    if (!content) {
      toast.warn("Please enter some content...");
      return;
    }
    // OPTIMIZEME Optimize my performance by making a very small network request or no request for adding new comment
    setLocalCommentData(data);
    dispatch(addComment({ videoId, content }));
    inputRef.current.value = "";
  };

  if (!localCommentData) {
    return (
      <div className="fixed inset-0 top-full z-50 h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-16 peer-first:top-16 sm:static sm:max-h-[500px] lg:max-h-none">
        {/*  Add Comment */}
        <div className="block">
          <h6 className="mb-2 bg-slate-100/10 w-36 h-8 rounded animate-pulse"></h6>
          <div className="w-full rounded-lg border border-slate-100/50 p-1.5 flex items-center bg-slate-100/10 animate-pulse">
            <div className="w-full h-6"></div>
          </div>
        </div>
        <hr className="my-4 border-slate-100/50" />

        {/* Comments */}
        {Array(3)
          .fill()
          .map((_, index) => (
            <div key={index}>
              <div className="flex justify-between">
                {/* comment content */}
                <span className="flex w-full gap-x-4">
                  {/* Avatar */}
                  <div className="mt-2 h-12 w-12 shrink-0">
                    <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
                  </div>

                  {/* Content */}
                  <div className="block w-full">
                    <div className="flex items-center">
                      <span className="bg-slate-100/10 rounded animate-pulse w-44 h-4 mr-1"></span>
                      <span className="bg-slate-100/10 rounded animate-pulse w-16 h-4"></span>
                    </div>
                    <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                    <p className="my-1 text-[14px]">
                      <div className="text-transparent h-5 bg-slate-100/10 rounded animate-pulse w-[70%] outline-none border-b-[1px] border-transparent"></div>
                    </p>
                  </div>
                </span>
              </div>
              <hr className="my-2 border-slate-100/50" />
            </div>
          ))}
      </div>
    );
  }

  const comments = data || localCommentData;

  // Something went wrong Comments...
  if (!status && !comments)
    return (
      <div className="flex w-full h-screen flex-col gap-y-4 px-16 py-4 rounded bg-slate-100/10 animate-pulse"></div>
    );

  return (
    <div className="fixed inset-0 top-full z-50 h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-16 peer-first:top-16 sm:static sm:max-h-[500px] lg:max-h-none">
      <LoginPopup
        ref={loginPopupRef}
        message="Sign to comment on this video..."
      />

      {/* Add comment */}
      <div className="block">
        <h6 className="mb-4 text-lg text-[#f6f5f6] font-semibold">
          {comments.length > 0 ? comments.length : "NO"} Comments
        </h6>

        <form
          onSubmit={addCommentHandler}
          className="w-full rounded-lg border px-1 py-1 flex items-center"
        >
          <input
            type="text"
            name="content"
            ref={inputRef}
            placeholder="Add a comment"
            className="w-4/5 bg-transparent focus:outline-none px-2 py-1 placeholder-white"
          />

          <span className="w-1/5 flex justify-end mr-1">
            {/* Cancel button */}
            <button
              type="button"
              onClick={() => (inputRef.current.value = "")}
              className="rounded-3xl hover:border hover:border-b-white disabled:cursor-not-allowed hover:bg-gray-700 text-white text-sm font-semibold px-2 pb-1 mr-2"
            >
              Cancel
            </button>
            {/* Comment button */}
            <button
              type="submit"
              className="rounded-3xl bg-blue-500 disabled:bg-gray-800 hover:bg-blue-600 text-lg text-[#f6f5f6] font-semibold border border-b-white px-2 pb-1"
            >
              Comment
            </button>
          </span>
        </form>
      </div>
      <hr className="my-4 border-white" />

      {/* comments */}
      {comments.map((comment) => (
        <div key={comment._id}>
          <CommentLayout
            comment={comment}
            ownerAvatar={ownerAvatar}
            videoId={videoId}
          />
          <hr className="my-2 border-white" />
        </div>
      ))}
    </div>
  );
};

export default Comments;

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
  const [content, setContent] = useState("");

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
                      <span className="text-transparent h-5 bg-slate-100/10 rounded animate-pulse w-[70%] outline-none border-b-[1px] border-transparent"></span>
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

  console.log("comments in comments", comments);

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
          className="w-full flex flex-col gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"
        >
          <div className="flex items-start gap-3">
            {/* Auto-resizing textarea */}
            <textarea
              ref={inputRef}
              name="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                const el = inputRef.current;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
              rows={1}
              placeholder="Add a comment..."
              className="flex-1 resize-none overflow-hidden bg-transparent placeholder-gray-700 text-gray-950 px-3 py-2 rounded-lg focus:outline-none focus:ring-0 text-sm font-semibold"
            />
          </div>

          {/* Buttons appear only if text exists */}
          {content.trim().length > 0 && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setContent("");
                  inputRef.current.style.height = "44px";
                }}
                className="rounded-full px-4 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
              >
                Comment
              </button>
            </div>
          )}
        </form>
      </div>
      <hr className="my-4 border-white" />

      {/* comments */}
      {Array.isArray(comments?.data?.docs) && comments.data.docs.length > 0 ? (
        comments.data.docs.map((comment) => (
          <div key={comment._id}>
            <CommentLayout
              comment={comment}
              ownerAvatar={ownerAvatar}
              videoId={videoId}
            />
            <hr className="my-2 border-white" />
          </div>
        ))
      ) : (
        <p className="text-gray-400">No comments yet</p>
      )}
    </div>
  );
};

export default Comments;

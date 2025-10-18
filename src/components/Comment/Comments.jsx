import { addComment, getVideoComments } from "@/app/Slices/commentSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoginPopup from "../auth/LoginPopup";
import CommentLayout from "./CommentLayout";

const Comments = ({ videoId, ownerAvatar }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const loginPopupRef = useRef();

  const { isAuthenticated } = useSelector(({ auth }) => auth);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  // Fetch comments whenever videoId changes
  useEffect(() => {
    if (!videoId) return;

    dispatch(getVideoComments(videoId)).then((res) => {
      setComments(res.payload?.data?.docs || []);
    });
  }, [videoId, dispatch]);

  // Add comment (optimistic UI)
  const addCommentHandler = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return loginPopupRef.current.open();
    if (!content.trim()) return toast.warn("Please enter a comment...");

    const tempComment = {
      _id: Date.now().toString(),
      content,
      owner: { username: "You", avatar: ownerAvatar },
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [tempComment, ...prev]);
    setContent("");
    inputRef.current.style.height = "44px";

    try {
      const res = await dispatch(addComment({ videoId, content })).unwrap();
      setComments((prev) =>
        prev.map((c) => (c._id === tempComment._id ? res.data : c))
      );
    } catch (err) {
      toast.error("Failed to add comment");
      console.log("comments err", err);
      setComments((prev) => prev.filter((c) => c._id !== tempComment._id));
    }
  };

  // Update comment locally after edit
  const updateCommentLocally = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
    );
  };

  // Delete comment locally after delete
  const deleteCommentLocally = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  // Show loading skeleton if comments not loaded yet
  if (!comments) {
    return (
      <div className="p-4 animate-pulse space-y-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        {Array(3)
          .fill()
          .map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div
      key={videoId}
      className="relative max-w-full mx-auto bg-white dark:bg-[#121212] transition-colors duration-300"
    >
      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between p-4 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <h6 className="text-lg font-semibold text-gray-900 dark:text-white">
          {comments.length} Comment{comments.length !== 1 && "s"}
        </h6>
        <button
          className="text-gray-900 dark:text-white text-lg hover:text-gray-600 dark:hover:text-gray-300 transition"
          onClick={() => window.history.back()}
          aria-label="Close comments"
        >
          ✕
        </button>
      </div>

      {/* Comment Input Section */}
      <div className="p-4 sm:p-6">
        <LoginPopup
          ref={loginPopupRef}
          message="Sign in to comment on this video..."
        />
        <div className="sm:block hidden mb-6">
          <h6 className="text-xl font-semibold text-gray-900 dark:text-white">
            {comments.length} Comment{comments.length !== 1 && "s"}
          </h6>
        </div>
        <form
          onSubmit={addCommentHandler}
          className="w-full flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200"
        >
          <textarea
            ref={inputRef}
            name="content"
            value={content}
            onChange={(e) => {
              if (!isAuthenticated) return loginPopupRef.current.open();
              setContent(e.target.value);
              const el = inputRef.current;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`; // Limit max height
            }}
            rows={1}
            placeholder="Add a comment..."
            className="w-full resize-none overflow-hidden bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:outline-none text-sm font-medium transition-colors"
            aria-label="Comment input"
          />
          {content.trim().length > 0 && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setContent("");
                  inputRef.current.style.height = "44px";
                }}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Cancel comment"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 active:scale-95 transition transform"
                aria-label="Submit comment"
              >
                Comment
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Comments List */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="pb-4">
              <CommentLayout
                comment={comment}
                ownerAvatar={ownerAvatar}
                videoId={videoId}
                updateCommentLocally={updateCommentLocally}
                deleteCommentLocally={deleteCommentLocally}
              />
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;

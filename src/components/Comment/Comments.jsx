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
      <div className="p-4 animate-pulse">
        <div className="h-6 w-32 bg-gray-400 mb-2 rounded"></div>
        {Array(3)
          .fill()
          .map((_, i) => (
            <div key={i} className="flex gap-3 items-start mb-2">
              <div className="h-12 w-12 bg-gray-400 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-400 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-400 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-16 z-50 overflow-auto rounded-lg border bg-[#121212] p-4 sm:static sm:max-h-[500px] lg:max-h-none">

      <LoginPopup
        ref={loginPopupRef}
        message="Sign in to comment on this video..."
      />

      {/* Add comment */}
      <div className="mb-4">
        <h6 className="mb-4 text-lg text-[#f6f5f6] font-semibold">
          {comments.length} Comment{comments.length !== 1 && "s"}
        </h6>

        <form
          onSubmit={addCommentHandler}
          className="w-full flex flex-col gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"
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
              el.style.height = `${el.scrollHeight}px`;
            }}
            rows={1}
            placeholder="Add a comment..."
            className="flex-1 resize-none overflow-hidden bg-transparent placeholder-gray-700 text-gray-950 px-3 py-2 rounded-lg focus:outline-none focus:ring-0 text-sm font-semibold"
          />
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

      {/* Comments list */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id}>
            <CommentLayout
              comment={comment}
              ownerAvatar={ownerAvatar}
              videoId={videoId}
              updateCommentLocally={updateCommentLocally}
              deleteCommentLocally={deleteCommentLocally}
            />
            <hr className="my-3 border-white" />
          </div>
        ))
      ) : (
        <p className="text-gray-400">No comments yet</p>
      )}
    </div>
  );
};

export default Comments;

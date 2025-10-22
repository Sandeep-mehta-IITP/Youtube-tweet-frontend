import { createTweet, getAllTweets } from "@/app/Slices/tweetSlice";
import LoginPopup from "@/components/auth/LoginPopup";
import EmptyTweet from "@/components/Tweet/EmptyTweet";
import TweetLayout from "@/components/Tweet/TweetLayout";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const FeedTweets = ({ owner = false }) => {
  const dispatch = useDispatch();
  const loginPopUpRef = useRef();

  const { data, status } = useSelector(({ tweet }) => tweet);
  const { isAuthenticated } = useSelector(({ auth }) => auth);

  const [localTweets, setLocalTweets] = useState([]);
  const { register, handleSubmit, reset, setFocus } = useForm();

  //  Fetch tweets on mount or when login changes
  useEffect(() => {
    dispatch(getAllTweets()).then((res) => {
      if (res?.payload?.docs) {
        setLocalTweets(res.payload.docs);
      } else if (Array.isArray(res?.payload)) {
        setLocalTweets(res.payload);
      } else {
        setLocalTweets([]);
      }
    });
  }, [dispatch, isAuthenticated]);

  //  Add tweet
  const addTweet = (formData) => {
    if (!isAuthenticated) {
      return loginPopUpRef.current.open();
    }

    const tweetContent = formData.tweet?.trim();
    if (!tweetContent) {
      toast.error("Content is required");
      return setFocus("tweet");
    }
    if (tweetContent.length < 20) {
      toast.error("Minimum 20 characters are required");
      return setFocus("tweet");
    }
    if (tweetContent.length > 700) {
      toast.error("Maximum 700 characters are allowed");
      return setFocus("tweet");
    }

    dispatch(createTweet({ content: tweetContent })).then((res) => {
      if (res?.payload?.tweet || res?.payload?._id) {
        const newTweet = res.payload.tweet || res.payload;
        setLocalTweets((prev) => [newTweet, ...prev]);
      } else {
        dispatch(getAllTweets());
      }
      reset();
    });
  };

  //  Choose between global & local tweets safely
  const tweets = Array.isArray(data) && data.length > 0 ? data : localTweets;

  //  Show skeleton when loading
  if (!tweets || (tweets.length === 0 && !status)) {
    return (
      <section className="w-full py-1 px-3 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 animate-pulse">
        {/* Input skeleton */}
        <div className="mt-2 border pb-2 bg-gray-200/10 dark:bg-gray-800/30 rounded-md">
          <div className="mb-2 h-12 w-full px-3 pt-2 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
          <div className="flex items-center justify-end gap-x-3 px-3">
            <div className="w-20 h-10 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
          </div>
        </div>

        <hr className="my-3 border-gray-300/20 dark:border-gray-600/30" />

        {/* Tweets skeleton */}
        <div className="space-y-4">
          {Array(6)
            .fill()
            .map((_, i) => (
              <div key={i} className="px-1">
                <div className="flex gap-x-4">
                  <div className="mt-2 h-12 w-12 rounded-full bg-gray-200/20 dark:bg-gray-700/20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-44 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
                      <div className="h-5 w-16 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
                    </div>
                    <div className="h-3 w-32 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
                    <div className="h-6 w-1/2 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
                  </div>
                </div>
                <hr className="my-3 border-gray-300/20 dark:border-gray-700/20" />
              </div>
            ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <LoginPopup ref={loginPopUpRef} message="Sign in to Tweet..." />

      <section className="w-full py-1 px-3 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        {/* Tweet Input */}
        <form onSubmit={handleSubmit(addTweet)} className="mt-2 border pb-2">
          <textarea
            {...register("tweet")}
            className="w-full resize-none overflow-hidden bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:outline-none text-sm font-medium transition-colors"
            placeholder="What's on your mind today..."
          ></textarea>

          <div className="flex items-center justify-end gap-x-3 px-3">
            <button
              type="button"
              onClick={() => reset()}
              className="py-1 rounded-xl px-3 hover:text-black hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 px-3 py-2 font-semibold text-white rounded-xl hover:bg-blue-600 transition"
            >
              Tweet
            </button>
          </div>
        </form>

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        {/* Tweet List */}
        {tweets.length > 0 ? (
          <ul>
            {tweets.map((tweet) => (
              <TweetLayout
                key={tweet?._id}
                tweet={tweet}
                owner={tweet?.isOwner}
              />
            ))}
          </ul>
        ) : (
          <EmptyTweet />
        )}
      </section>
    </>
  );
};

export default FeedTweets;

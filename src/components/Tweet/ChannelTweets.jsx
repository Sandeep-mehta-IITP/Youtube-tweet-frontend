import { createTweet, getUserTweets } from "@/app/Slices/tweetSlice";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdSentimentDissatisfied } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChannelTweets = ({ owner = false }) => {
  const dispatch = useDispatch();
  let { username } = useParams();

  const { data, status } = useSelector(({ tweet }) => tweet);
  const userId = useSelector((state) => state.user.userData?._id);
  const { isAuthenticated, userData: currentUser } = useSelector(
    ({ auth }) => auth
  );

  const [localTweets, setLocalTweets] = useState(null);
  const { register, handleSubmit, reset, setFocus } = useForm();

  useEffect(() => {
    if (owner) {
      userId = currentUser?._id;
    }

    if (!userId) return;

    dispatch(getUserTweets(userId)).then((res) => {
      if (res.meta.requestStatus == "fulfilled") {
        setLocalTweets(res.payload);
      }
    });
  }, [userId, isAuthenticated, owner]);

  const addTweet = (data) => {
    if (!data.tweet.trim()) {
      toast.error("Content is required");
      setFocus("tweet");
      return;
    } else if (data.tweet.trim()?.length < 20) {
      toast.error("Minimum 20 characters are required");
      setFocus("tweet");
      return;
    } else if (data.tweet.trim()?.length > 700) {
      toast.error("Maximum 700 characters are allowed");
      setFocus("tweet");
      return;
    }

    dispatch(createTweet({ content: data })).then(() => {
      getUserTweets(currentUser?._id);
      reset();
    });
  };

  if (!localTweets) {
    return (
      <section className="w-full py-1 px-3 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 animate-pulse">
        {/* Top Input Skeleton */}
        <div className="mt-2 border pb-2 bg-gray-200/10 dark:bg-gray-800/30 rounded-md">
          <div className="mb-2 h-12 w-full px-3 pt-2 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
          <div className="flex items-center justify-end gap-x-3 px-3">
            <div className="w-20 h-10 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
          </div>
        </div>

        <hr className="my-3 border-gray-300/20 dark:border-gray-600/30" />

        {/* Tweets Skeleton List */}
        <div className="space-y-4">
          {Array(7)
            .fill()
            .map((_, i) => (
              <div key={i} className="px-1">
                <div className="flex gap-x-4">
                  {/* Avatar */}
                  <div className="mt-2 h-12 w-12 rounded-full bg-gray-200/20 dark:bg-gray-700/20"></div>

                  {/* Content */}
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

  let tweets = data || localTweets;

  if (!status && !tweets) {
    return (
      <div className="flex w-full h-screen flex-col gap-y-4 px-16 py-4 rounded bg-slate-100/10 animate-pulse"></div>
    );
  }
  return (
    <>
      {owner && (
        <form onSubmit={handleSubmit(addTweet)} className="mt-2 border pb-2">
          <textarea
            {...register("tweet")}
            className="w-full resize-none overflow-hidden bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:outline-none text-sm font-medium transition-colors"
            placeholder="Write a tweet"
          ></textarea>

          <div className="flex items-center justify-end gap-x-3 px-3">
            {/* Emoji button */}
            <button
              type="button"
              className="inline-block h-5 w-5 hover:text-blue-400"
            >
              <MdSentimentDissatisfied className="w-14 h-14 text-gray-200" />
            </button>
            {/* Cancel button */}
            <button
              type="button"
              onClick={() => reset()}
              className="py-1 rounded-xl px-3 hover:text-black hover:bg-slate-500"
            >
              cancel
            </button>
            {/* send button */}
            <button
              type="submit"
              className="bg-blue-500 px-3 py-2 font-semibold text-white"
            >
              Tweet
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ChannelTweets;

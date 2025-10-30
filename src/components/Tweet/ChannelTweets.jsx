import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { createTweet, getUserTweets } from "@/app/Slices/tweetSlice";
import TweetLayout from "./TweetLayout";
import MyChannelEmptyTweet from "./MyChannelEmptyTweet";
import EmptyTweet from "./EmptyTweet";

const ChannelTweets = ({ owner = false }) => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const { data: tweetsData, status } = useSelector((state) => state.tweet);
  const { isAuthenticated, userData: currentUser } = useSelector(
    (state) => state.auth
  );
  const userId = owner
    ? currentUser?._id
    : useSelector((state) => state.user.userData?._id);

  const [tweets, setTweets] = useState([]);
  const { register, handleSubmit, reset, setFocus } = useForm();

  /** Fetch user tweets */
  const fetchTweets = useCallback(async () => {
    if (!userId) return;
    const res = await dispatch(getUserTweets(userId));
    if (res.meta.requestStatus === "fulfilled") {
      setTweets(res.payload);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets, isAuthenticated]);

  /** Add new tweet */
  const handleAddTweet = async (formData) => {
    const content = formData.tweet?.trim();

    if (!content) {
      toast.error("Tweet content is required");
      setFocus("tweet");
      return;
    }
    if (content.length < 20) {
      toast.error("Minimum 20 characters required");
      setFocus("tweet");
      return;
    }
    if (content.length > 700) {
      toast.error("Maximum 700 characters allowed");
      setFocus("tweet");
      return;
    }

    const res = await dispatch(createTweet({ content }));
    if (res.meta.requestStatus === "fulfilled") {
      reset();
      fetchTweets();
    }
  };

  /** Skeleton Loader */
  if (status === "loading" && !tweets.length) {
    return (
      <section className="w-full py-1 px-3 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 animate-pulse">
        {/* Input Skeleton */}
        <div className="mt-2 border pb-2 bg-gray-200/10 dark:bg-gray-800/30 rounded-md">
          <div className="mb-2 h-12 w-full px-3 pt-2 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
          <div className="flex items-center justify-end gap-x-3 px-3">
            <div className="w-20 h-10 bg-gray-200/20 dark:bg-gray-700/20 rounded"></div>
          </div>
        </div>

        <hr className="my-3 border-gray-300/20 dark:border-gray-600/30" />

        {/* Tweet List Skeleton */}
        <div className="space-y-4">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div key={i} className="px-1">
                <div className="flex gap-x-4">
                  <div className="mt-2 h-12 w-12 rounded-full bg-gray-200/20 dark:bg-gray-700/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-44 bg-gray-200/20 dark:bg-gray-700/20 rounded" />
                    <div className="h-3 w-32 bg-gray-200/20 dark:bg-gray-700/20 rounded" />
                    <div className="h-6 w-3/4 bg-gray-200/20 dark:bg-gray-700/20 rounded" />
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
    <section className="w-full py-2 px-3 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {/* --- Tweet Input (Visible only for owner) --- */}
      {owner && (
        <form
          onSubmit={handleSubmit(handleAddTweet)}
          className="mt-2 border border-gray-700/50 rounded-lg bg-[#181818] p-3"
        >
          <textarea
            {...register("tweet")}
            rows={3}
            placeholder="What's happening?"
            className="w-full resize-none rounded-md bg-transparent px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none text-sm font-medium"
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-700/50 transition"
              title="Add Emoji"
            >
              <MdOutlineEmojiEmotions className="w-5 h-5 text-gray-300" />
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="px-3 py-1 text-sm rounded-md text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-sm font-semibold rounded-md text-white hover:bg-blue-700 active:scale-95 transition"
            >
              Tweet
            </button>
          </div>
        </form>
      )}

      {/* --- Tweets List --- */}
      {tweets?.length > 0 ? (
        <ul className="divide-y divide-gray-700/50 mt-4">
          {tweets.map((tweet) => (
            <TweetLayout key={tweet._id} tweet={tweet} owner={owner} />
          ))}
        </ul>
      ) : owner ? (
        <MyChannelEmptyTweet />
      ) : (
        <EmptyTweet />
      )}
    </section>
  );
};

export default ChannelTweets;

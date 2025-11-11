import { createTweet, getAllTweets } from "@/app/Slices/tweetSlice";
import LoginPopup from "@/components/auth/LoginPopup";
import EmptyTweet from "@/components/Tweet/EmptyTweet";
import TweetLayout from "@/components/Tweet/TweetLayout";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const FeedTweets = ({ owner = false }) => {
  const dispatch = useDispatch();
  const loginPopUpRef = useRef();

  const { data, status, loading } = useSelector(({ tweet }) => tweet);
  //console.log("tweet data", data);

  const { isAuthenticated } = useSelector(({ auth }) => auth);

  const [localTweets, setLocalTweets] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const { register, handleSubmit, reset, setFocus } = useForm();

  /** Fetch tweets **/
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await dispatch(getAllTweets()).unwrap();
        const tweetsArray = res?.docs || (Array.isArray(res) ? res : []);
        setLocalTweets(tweetsArray);
      } catch {
        toast.error("Failed to load tweets");
        setLocalTweets([]);
      }
    };
    fetchTweets();
  }, [dispatch, isAuthenticated]);

  /** Handle add tweet **/
  const addTweet = useCallback(
    async (formData) => {
      if (!isAuthenticated) return loginPopUpRef.current.open();

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

      setIsPosting(true);
      try {
        await dispatch(createTweet({ content: tweetContent })).unwrap();
        reset();
        await dispatch(getAllTweets());
      } catch {
        toast.error("Failed to post tweet");
      } finally {
        setIsPosting(false);
      }
    },
    [dispatch, isAuthenticated, reset, setFocus]
  );

  const tweets = Array.isArray(data) && data.length > 0 ? data : localTweets;

  //console.log("tweets in feed tweet", tweets);

  // tweets.map((tweet) => (
  //   console.log("tweet in feed", tweet)

  // ))
  

  //console.log("tweets in feed tweets", tweets);
  

  /** Skeleton Loader **/
  if (loading && (!tweets || tweets.length === 0)) {
    return (
      <section className="w-full py-3 px-3 sm:ml-[70px] lg:ml-0 animate-pulse">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-5">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/4 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/2 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <>
      <LoginPopup ref={loginPopUpRef} message="Sign in to Tweet..." />

      <section className="w-full py-3 px-3 sm:ml-[70px] lg:ml-0">
        {/* Tweet Composer */}
        <form
          onSubmit={handleSubmit(addTweet)}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 transition"
        >
          <div className="flex gap-3">
            <textarea
              {...register("tweet")}
              className="flex-1 resize-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-0 min-h-[60px] mt-1"
              placeholder="What's happening?"
              maxLength={700}
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => reset()}
              disabled={isPosting}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Tweet"
              )}
            </button>
          </div>
        </form>

        <hr className="my-5 border-gray-200 dark:border-gray-700" />

        {/* Tweet Feed */}
        {tweets?.length > 0 ? (
          <ul className="space-y-4">
            {tweets.map((tweet) => (
              <TweetLayout
                key={tweet?._id}
                tweet={tweet}
                owner={owner}
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

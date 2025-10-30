import {
  getChannelSubscribers,
  getSubscribedChannels,
} from "@/app/Slices/subscriptionSlice";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubscriptionUser from "./SubscriptionUser";
import MyChannelEmptySubscription from "./MyChannelEmptySubscription";
import EmptySubscription from "./EmptySubscription";

const Subscribed = ({ owner = false, isSubscribers = false }) => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const userStateId = useSelector((state) => state.user.userData?._id);
  const currentUser = useSelector((state) => state.auth.userData);
  let { data, loading, status } = useSelector((state) => state.subscription);

  const channelId = owner ? currentUser?._id : userStateId;

  const [subscribedFiltered, setSubscribedFiltered] = useState(null);

  useEffect(() => {
    if (!channelId && !isSubscribers) return;
    if (isSubscribers) {
      console.log("isSubscribes", isSubscribers);
      dispatch(getChannelSubscribers(currentUser?._id));
    } else {
      dispatch(getSubscribedChannels(channelId));
    }
  }, [dispatch, channelId, currentUser, username]);

  if (!isSubscribers && (loading || !channelId)) {
    return (
      <div className="flex flex-col gap-y-4 pt-1">
        <div className="flex flex-col gap-y-4 pt-4">
          {/* Header Skeleton */}
          <div className="relative mb-2 rounded-sm bg-slate-100/10 animate-pulse py-2 pl-8 pr-3">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></span>
            <div className="w-full h-6 bg-transparent outline-none" />
          </div>

          {/* Repeated Skeleton Items */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex w-full justify-between items-center"
            >
              <div className="flex items-center gap-x-2">
                <div className="h-14 w-14 shrink-0 bg-slate-100/10 rounded-full animate-pulse"></div>
                <div className="block">
                  <h6 className="font-semibold mb-2 bg-slate-100/10 animate-pulse h-4 w-24 rounded"></h6>
                  <p className="text-sm text-gray-300 bg-slate-100/10 animate-pulse h-4 w-32 rounded"></p>
                </div>
              </div>

              <div className="block">
                <div className="group/btn px-4 py-2 text-black bg-slate-100/10 rounded-full animate-pulse">
                  <span className="inline-block w-24 h-4 rounded"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  let subscribed = subscribedFiltered || data;

  if ((!status && !loading) || !subscribed)
    return (
      <div className="flex w-full h-screen flex-col gap-y-4 px-16 py-4 rounded bg-slate-100/10 animate-pulse"></div>
    );

  const handleInputData = (input) => {
    if (!input) {
      setSubscribedFiltered(data);
    } else {
      const filteredData = data.filter((item) =>
        item.fullName.toLowerCase().includes(input.toLowerCase())
      );
      setSubscribedFiltered(filteredData);
    }
  };

  return data.length > 0 ? (
    <ul
      className={`flex w-full flex-col gap-y-4 ${isSubscribers ? "px-8 py-8 sm:px-16 sm:py-12" : "py-4"}`}
    >
      {/* Search Bar */}
      <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-6 h-6 text-[#f6f5f6] font-bold" />
        </span>
        <input
          onChange={(e) => handleInputData(e.target.value.trim())}
          className="w-full bg-transparent outline-none"
          placeholder="Search"
        />
      </div>

      {/* Subscribed Users List */}
      {subscribed.map((profile) => (
        <SubscriptionUser key={profile._id} profile={profile} />
      ))}
    </ul>
  ) : owner ? (
    <MyChannelEmptySubscription />
  ) : (
    <EmptySubscription />
  );
};

export default Subscribed;

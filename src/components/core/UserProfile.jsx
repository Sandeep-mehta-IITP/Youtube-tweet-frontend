import { toggleSubscription } from "@/app/Slices/subscriptionSlice";
import { channelProfile } from "@/app/Slices/userSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPopup from "../auth/LoginPopup";
import { Link } from "react-router-dom";
import { formatCount } from "@/utils/helpers/formatFigure";
import { CheckCircle, UserPlus } from "lucide-react";

const UserProfile = ({ userId }) => {
  const loginPopupRef = useRef();
  const dispatch = useDispatch();

  const { userData, loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [localData, setLocalData] = useState("");

  useEffect(() => {
    if (!userId) return;

    dispatch(channelProfile(userId)).then((res) => setLocalData(res.payload));
  }, [dispatch, userId]);

  const subscripationToggleHandler = async (channelId) => {
    if (!isAuthenticated) return loginPopupRef.current.open();

    setLocalData((pre) => ({ ...pre, isSubscribed: !pre.isSubscribed }));
    dispatch(toggleSubscription(channelId)).then(() =>
      dispatch(channelProfile(userId))
    );
  };

  if ((!localData && loading) || !userId) {
    return (
      <div className="mt-4 flex items-center justify-between">
        {/* Owner Data */}
        <div key="owner-data" className="flex items-center gap-x-4">
          {/* Avatat */}
          <div className="mt-2 h-12 w-12 shrink-0">
            <div className="h-full w-full rounded-full bg-slate-100/10 animate-pulse"></div>
          </div>
          {/* Owner username , fullname */}
          <div className="block mt-2">
            <p className="text-transparent sm:w-52 h-5 mb-1 bg-slate-100/10 rounded animate-pulse"></p>
            <p className="text-sm text-transparent w-32 h-5 bg-slate-100/10 rounded animate-pulse"></p>
          </div>
        </div>

        {/* Subscription button */}
        <div key="subscribe-btn" className="block">
          <div
            className={`group/btn mr-1 flex w-full items-center gap-x-2 px-3 py-2 text-center font-bold text-transparent bg-slate-100/10 rounded animate-pulse sm:w-auto`}
          >
            <span className="inline-block w-16 sm:w-32 h-8"></span>
          </div>
        </div>
      </div>
    );
  }

  let profileData = userData || localData;

  // console.log("profileData in userProfile", profileData);
  // console.log("channelId in userProfile", profileData?._id);

  // Something went wrong Profile...
  if (!profileData)
    return (
      <div className="flex w-full h-screen flex-col gap-y-4 px-16 py-4 rounded bg-slate-100/10 animate-pulse"></div>
    );

  return (
    <div className="w-full mt-4 flex overflow-hidden items-center justify-between mx-2 sm:mx-3">
      <LoginPopup ref={loginPopupRef} message="Sign in to subscribe..." />
      {/* Owner Data */}
      <div key="owner-data" className="flex items-center gap-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 shrink-0">
          <Link to={`/user/${profileData?.username}`}>
            <img
              src={profileData?.avatar}
              alt={profileData?.fullName}
              className="w-full h-full rounded-full"
            />
          </Link>
        </div>

        {/* Owner name , username */}
        <div className="block">
          <p className="text-gray-200 hover:text-gray-300">
            <Link to={`/user/${profileData?.username}`}>
              {profileData?.fullName}
            </Link>
          </p>
          <p className="text-sm text-gray-400">
            {formatCount(profileData?.subscribersCount)}
          </p>
        </div>
      </div>

      {/* Subscription button */}
      <div
        key="subscribe-btn"
        onClick={() => subscripationToggleHandler(profileData._id)}
        className="block"
      >
        <button
          className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-full font-semibold text-sm transition-all duration-200
    ${
      profileData?.isSubscribed
        ? "bg-teal-600 text-white shadow-md hover:bg-teal-800"
        : "bg-white text-black shadow hover:bg-gray-100"
    }
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500
    active:scale-95 active:shadow-none
    sm:w-auto w-full justify-center`}
        >
          <span className="inline-block w-6">
            {profileData?.isSubscribed ? (
              <CheckCircle size={20} strokeWidth={2} />
            ) : (
              <UserPlus size={20} strokeWidth={2} />
            )}
          </span>
          <span>{profileData?.isSubscribed ? "Subscribed" : "Subscribe"}</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;

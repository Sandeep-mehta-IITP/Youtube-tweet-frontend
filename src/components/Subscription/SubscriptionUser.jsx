import { toggleSubscription } from "@/app/Slices/subscriptionSlice";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPopup from "../auth/LoginPopup";
import { formatCount } from "@/utils/helpers/formatFigure";
import { Link } from "react-router-dom";
import { CheckCircle, UserPlus } from "lucide-react";

const SubscriptionUser = ({ profile }) => {
  console.log("profile", profile);

  const dispatch = useDispatch();
  const loginPopupRef = useRef();

  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const [isSubscribed, setIsSubscribed] = useState(profile.isSubscribed);

  console.log("userData in subsriptionuser", userData);
  const isOwner = userData?._id === profile._id;

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      return loginPopupRef.current.open();
    }

    await dispatch(toggleSubscription(profile?._id));
    setIsSubscribed((prev) => !prev);
  };

  return (
    <>
      <LoginPopup ref={loginPopupRef} message="Sign in to Subscribe...." />
      <li key={profile._id} className="w-full flex justify-between mb-3">
        <div className="flex items-center gap-x-2">
          <div className="h-14 w-14 shrink-0">
            <Link to={`/user/${profile.username}`}>
              <img
                src={profile.avatar}
                alt={profile.username}
                className="h-full w-full rounded-full object-cover"
              />
            </Link>
          </div>
          <div className="block">
            <h6 className="font-semibold">
              <Link to={`/user/${profile.username}`}>{profile.fullName}</Link>
            </h6>
            <p className="text-sm text-gray-300">
              {formatCount(profile.totalSubscribers)}
            </p>
          </div>
        </div>
        {!isOwner && (
          <div className="block">
            <button
              onClick={handleSubscribe}
              className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-full font-semibold text-sm transition-all duration-200
    ${
      isSubscribed
        ? "bg-teal-600 text-white shadow-md hover:bg-teal-800"
        : "bg-white text-black shadow hover:bg-gray-100"
    }
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500
    active:scale-95 active:shadow-none
    sm:w-auto w-full justify-center`}
            >
              <span className="inline-block w-6">
                {isSubscribed ? (
                  <CheckCircle size={20} strokeWidth={2} />
                ) : (
                  <UserPlus size={20} strokeWidth={2} />
                )}
              </span>
              <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
            </button>
          </div>
        )}
      </li>
    </>
  );
};

export default SubscriptionUser;

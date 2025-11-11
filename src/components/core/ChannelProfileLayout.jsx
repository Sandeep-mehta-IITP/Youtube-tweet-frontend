import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Pencil, UserPlus } from "lucide-react";
import { toggleSubscription } from "@/app/Slices/subscriptionSlice";
import LoginPopup from "../auth/LoginPopup";
import { formatCount } from "@/utils/helpers/formatFigure";

const ChannelProfileLayout = ({ profile, owner = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginPopupRef = useRef();
  const { isAuthenticated } = useSelector(({ auth }) => auth);

  console.log("profile in channel", profile);
  

  const [isSubscribed, setIsSubscribed] = useState(
    profile?.isSubscribed || false
  );

  const handleSubscription = () => {
    if (!isAuthenticated) return loginPopupRef.current.open();
    dispatch(toggleSubscription(profile?._id));
    setIsSubscribed((prev) => !prev);
  };

  return (
    <section className="flex flex-wrap items-center justify-between gap-6 pb-4 pt-6">
      <LoginPopup ref={loginPopupRef} message="Sign in to subscribe..." />

      {/* --- Profile Info --- */}
      <div className="flex items-center gap-4 flex-grow min-w-[250px]">
        <span className="relative -mt-10 inline-block size-24 sm:size-28 shrink-0 overflow-hidden rounded-full border-2 border-gray-700">
          <img
            src={profile?.avatar}
            alt={profile?.fullName || "User avatar"}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </span>

        <div>
          <h2 className="text-xl font-bold text-white">{profile?.fullName}</h2>
          <p className="text-sm text-gray-400">@{profile?.username}</p>
          <p className="text-sm text-gray-400 mt-1">
            {formatCount(profile?.subscribersCount)} ·{" "}
            {profile.channelsSubscribedToCount} subscribed
          </p>
        </div>
      </div>

      {/* --- Action Button --- */}
      <div>
        {owner ? (
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
          >
            <Pencil size={18} /> Edit Channel
          </button>
        ) : (
          <button
            onClick={handleSubscription}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              isSubscribed
                ? "bg-teal-600 text-white hover:bg-teal-700 hover:scale-105"
                : "bg-red-600 text-white hover:bg-red-700 hover:scale-105"
            }`}
          >
            {isSubscribed ? <CheckCircle size={18} /> : <UserPlus size={18} />}
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>
    </section>
  );
};

export default ChannelProfileLayout;

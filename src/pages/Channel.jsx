import { channelProfile } from "@/app/Slices/userSlice";
import ChannelProfileLayout from "@/components/core/ChannelProfileLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

const Channel = ({ owner = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams();

  const loggedInUsername = useSelector(
    (state) => state.auth.userData?.username
  );
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!owner && loggedInUsername === username)
      navigate(`/channel/${loggedInUsername}`);
    if (!username) return;

    dispatch(channelProfile(username)).then((res) => setProfile(res.payload));
  }, [dispatch, username, loggedInUsername, navigate, owner]);

  const tabList = [
    { name: "Videos", route: "" },
    { name: "Playlists", route: "playlists" },
    { name: "Tweets", route: "tweets" },
    { name: "Subscribers", route: "subscribed" },
    { name: "About", route: "about" },
  ];

  return profile ? (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {/* --- Cover Image --- */}
      <div className="relative mt-2 w-full aspect-[16/10] md:aspect-[16/3.5] overflow-hidden rounded-lg">
        <img
          src={profile?.coverImage}
          alt={profile?.username}
          className="absolute inset-0 w-full h-full object-cover object-center md:object-top"
        />
      </div>

      <div className="px-4 pb-6 -mt-4">
        <ChannelProfileLayout profile={profile} owner={owner} />

        {/* --- Tabs --- */}
        <ul className="no-scrollbar sticky top-[66px] z-[5] flex gap-x-3 overflow-x-auto border-b border-gray-700 bg-[#121212] py-3 sm:top-[82px]">
          {tabList.map((item) => (
            <li key={item.name} className="flex-1 min-w-[100px]">
              <NavLink
                to={item.route}
                end
                className={({ isActive }) =>
                  `block text-center rounded-t-lg px-3 py-2 font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black border-b-2 border-blue-500"
                      : "text-blue-400 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <Outlet />
      </div>
    </section>
  ) : (
    // Skeleton
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="relative w-full aspect-[16/5] bg-gray-700/30 animate-pulse" />

      <div className="px-4 pb-4">
        {/* Profile Skeleton */}
        <div className="flex flex-wrap gap-4 pb-6 pt-6">
          <div className="h-28 w-28 rounded-full bg-gray-700/30 animate-pulse" />
          <div className="space-y-3">
            <div className="h-5 w-32 bg-gray-700/30 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-700/30 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-700/30 rounded animate-pulse" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <ul className="flex gap-x-2 border-b border-gray-700 bg-[#121212] py-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <li
                key={i}
                className="flex-1 h-10 bg-gray-700/30 rounded animate-pulse"
              ></li>
            ))}
        </ul>

        <div className="h-64 w-full bg-gray-700/30 rounded animate-pulse mt-4" />
      </div>
    </section>
  );
};

export default Channel;

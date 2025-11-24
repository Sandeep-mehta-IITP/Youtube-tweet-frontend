import {
  BarChart2,
  HelpCircle,
  History,
  Home,
  ListVideo,
  MonitorPlay,
  Settings,
  ThumbsUp,
  Twitter,
  VideoIcon,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Aside = () => {
  const asideOpen = useSelector((state) => state.ui.asideOpen);
  const username = useSelector((state) => state.auth.userData?.username);

  const navElements = [
    { name: "Home", icon: <Home className="w-6 h-6" />, route: "/" },
    {
      name: "History",
      icon: <History className="w-6 h-6" />,
      route: "/feed/history",
    },
    {
      name: "Subscriptions",
      icon: <MonitorPlay className="w-6 h-6" />,
      route: `/channel/${username}/subscriptions`,
    },
    {
      name: "Liked Videos",
      icon: <ThumbsUp className="w-6 h-6" />,
      route: "feed/liked-videos",
    },
    {
      name: "Playlists",
      icon: <ListVideo className="w-6 h-6" />,
      route: `/channel/${username}/playlists`,
    },
    {
      name: "Your Videos",
      icon: <VideoIcon className="w-6 h-6" />,
      route: `/channel/${username}`,
    },
    { name: "Tweets", icon: <Twitter className="w-6 h-6" />, route: "/feed/tweets" },
    {
      name: "Dashboard",
      icon: <BarChart2 className="w-6 h-6" />,
      route: "/admin/dashboard",
    },
    {
      name: "Support",
      icon: <HelpCircle className="w-6 h-6" />,
      route: "/support",
    },
    {
      name: "Settings",
      icon: <Settings className="w-6 h-6" />,
      route: "/settings",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed h-screen bg-[#121212] pt-4 
          ${asideOpen ? "w-60" : "w-16"} hidden sm:block`}
      >
        <ul className="flex flex-col gap-3.5 ml-2">
          {navElements?.map((item) => (
            <li key={item.route} className="w-full">
              <NavLink
                to={item.route}
                end
                className={({ isActive }) =>
                  `flex items-center transition-all duration-200 rounded-lg group
                  ${isActive ? "bg-[#383737] text-white" : "text-gray-400 hover:bg-[#383838] hover:text-white"} px-3 py-2 min-w-0`
                }
              >
                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                  {item.icon}
                </span>
                {asideOpen && (
                  <span className="ml-4 font-medium text-sm whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile Footer Nav */}
      <nav className="fixed bottom-0 left-0 right-0 sm:hidden bg-[#121212] border-t border-gray-800 overflow-x-auto py-3 z-50">
        <div className="flex justify-evenly gap-6 px-5">
          {navElements.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              end
              className={({ isActive }) =>
                `flex flex-col items-center text-gray-400 ${isActive ? "text-white" : "hover:text-white"}`
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Aside;

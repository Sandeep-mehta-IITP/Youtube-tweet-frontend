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

  const navElements = [
    {
      name: "Home",
      icon: <Home className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/",
    },
    {
      name: "History",
      icon: <History className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/history",
    },
    {
      name: "Subscriptions",
      icon: <MonitorPlay className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/subscriptions",
    },
    {
      name: "Liked Videos",
      icon: <ThumbsUp className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/liked-videos",
    },
    {
      name: "Playlists",
      icon: <ListVideo className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/playlists",
    },
    {
      name: "Your Videos",
      icon: <VideoIcon className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/your-videos",
    },
    {
      name: "Tweets",
      icon: <Twitter className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/tweets",
    },
    {
      name: "Dashboard",
      icon: <BarChart2 className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/dashboard",
    },
    {
      name: "Support",
      icon: <HelpCircle className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/support",
    },
    {
      name: "Settings",
      icon: <Settings className="w-6 h-6 text-[#f6f5f6]" />,
      route: "/settings",
    },
  ];

  return (
    <aside
      className={`fixed h-screen bg-[#121212] pt-4 transition-all duration-300 
        ${asideOpen ? "w-60" : "w-20"}
      `}
    >
      <ul className={`flex flex-col gap-3.5 ${asideOpen ? 'ml-2' : 'ml-1'}`}>
        {navElements?.map((item) => (
          <li key={item.route} className="w-full">
            <NavLink
              to={item.route}
              end
              className={({ isActive }) =>
                `flex items-center transition-all duration-200 rounded-lg group
                ${
                  isActive
                    ? "bg-[#383838] text-white"
                    : "text-gray-400 hover:bg-[#383838] hover:text-white"
                } px-3 py-2 min-w-0`
              }
            >
              {/* Icon */}
              <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </span>

              {/* Label */}
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
  );
};

export default Aside;
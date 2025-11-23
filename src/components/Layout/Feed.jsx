import React from "react";
import Navbar from "../core/Navbar";
import Aside from "../core/Aside";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


const Feed = () => {
  const asideOpen = useSelector((state) => state.ui.asideOpen);
  return (
    <div>
      <Navbar />
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <Aside />
        <main
          className={`flex-1 overflow-y-auto 
            ${asideOpen ? "ml-0 sm:ml-60" : "ml-0 sm:ml-16"} `}
          id="scrollable_results_screen"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Feed;

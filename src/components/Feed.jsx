import React, { useState } from "react";
import Navbar from "./layout/Navbar";
import Aside from "./layout/Aside";
import { Outlet } from "react-router-dom";

const Feed = () => {
  const [asideOpen, setAsideOpen] = useState(true);
  return (
    <div>
      <Navbar />
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <Aside isOpen={asideOpen} />
        <main className="flex-1">
          <Outlet /> {/* Child pages will render here */}
        </main>
      </div>
    </div>
  );
};

export default Feed;

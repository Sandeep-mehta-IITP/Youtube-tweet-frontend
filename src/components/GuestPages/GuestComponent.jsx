import React, { useRef } from "react";
import LoginPopup from "../auth/LoginPopup";
import { LogInIcon } from "lucide-react";

const GuestComponent = ({
  icon,
  title = "Login to view this page",
  description = "",
  route,
  guest = true,
}) => {
  const loginPopUpRef = useRef();
  return (
    <section className="w-full flex items-center justify-center">
      {/* Icon */}
      <div className="w-14 h-14 text-sky-400 rounded-full">{icon}</div>

      {/* Title */}
      <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#f6f5f6]">
        {title}
      </p>

      {/* description */}
      <p className="text-lg font-normal text-white/80">{description}</p>

      {/* Login Popup */}
      {guest && (
        <>
          <LoginPopup route={route || ""} ref={loginPopUpRef} />
          <button
            onClick={() => loginPopUpRef.current.open()}
            className="flex items-center gap-5 px-5 py-3 rounded-lg bg-slate-700 text-white"
          >
            <LogInIcon className="w-5 h-5 text-sky-500" /> Log in
          </button>
        </>
      )}
    </section>
  );
};

export default GuestComponent;

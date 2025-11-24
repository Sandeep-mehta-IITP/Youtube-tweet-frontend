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
    <section className="w-full flex flex-col gap-6 items-center justify-center px-4 sm:px-6 lg:px-8 py-8 mt-16 sm:mt-24 md:mt-32">
      {/* Content Container for better readability on large screens */}
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 text-sky-400 rounded-full flex items-center justify-center">
          {icon}
        </div>

        {/* Title */}
        <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#f6f5f6] leading-tight">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-center text-base sm:text-lg md:text-xl font-normal text-white/90 leading-relaxed max-w-prose">
            {description}
          </p>
        )}

        {/* Login Button */}
        {guest && (
          <>
            <LoginPopup route={route || ""} ref={loginPopUpRef} />
            <button
              onClick={() => loginPopUpRef.current.open()}
              className="flex items-center gap-3 sm:gap-5 px-6 sm:px-8 py-3 rounded-lg bg-slate-700 hover:bg-gray-300 transition-colors duration-300 text-white hover:text-gray-900 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl"
            >
              <LogInIcon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 flex-shrink-0" />
              Log in
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default GuestComponent;
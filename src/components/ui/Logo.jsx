import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ width = "w-16 sm:w-20", className = "" }) => {
  return (
    <Link to="/">
      <div className={`mr-4 ${width} shrink-0 ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-full h-full"
        >
          <defs>
            {/* Gradient for body (blue to purple) */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00B5FF" />
              <stop offset="100%" stopColor="#4B3FE4" />
            </linearGradient>

            {/* Gradient for wings (purple to red/orange) */}
            <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4B3FE4" />
              <stop offset="50%" stopColor="#FF0066" />
              <stop offset="100%" stopColor="#FF6600" />
            </linearGradient>
          </defs>

          {/* Bird body */}
          <path
            d="M160 250c0-70 60-130 130-130 40 0 70 10 100 40s40 60 40 100-20 80-50 100-70 30-100 20-70-40-90-70-30-60-30-60z"
            fill="url(#bodyGradient)"
          />

          {/* Wing (right side) */}
          <path
            d="M250 120c40 20 80 50 120 100s50 100 30 140-60 60-100 40-70-70-80-110-10-90 30-130z"
            fill="url(#wingGradient)"
          />

          {/* Play button cutout */}
          <polygon
            points="220,200 220,300 310,250"
            fill="#ffffff"
          />
        </svg>
      </div>
    </Link>
  );
};

export default Logo;

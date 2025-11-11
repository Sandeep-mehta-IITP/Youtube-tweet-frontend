import { Loader2 } from "lucide-react";
import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 px-5 
        rounded-lg transition-all duration-200 ease-in-out 
        hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none 
        disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          {/* Smooth rotating loader */}
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span className="text-white text-sm font-medium">Loading...</span>
        </>
      ) : (
        children
      )}

      {/* Subtle overlay animation during loading */}
      {isLoading && (
        <span className="absolute inset-0 bg-white/10 rounded-lg animate-pulse"></span>
      )}
    </button>
  );
};

export default Button;

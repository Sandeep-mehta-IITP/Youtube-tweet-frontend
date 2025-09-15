import React from "react";

// Reusable Button component
const Button = ({
  children, // Button ka text ya content
  type = "button", // button, submit, reset
  onClick,
  disabled = false,
  isLoading = false, // loading state
  className = "", // extra styling
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;

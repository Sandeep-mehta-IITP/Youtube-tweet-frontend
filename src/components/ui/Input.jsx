import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      register,
      className = "", // input styling
      wrapperClass = "", // wrapper styling
      error,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col ${wrapperClass}`}>
        {label && (
          <label htmlFor={name} className="mb-1 font-medium text-[#f6f5f6]">
            {label}
          </label>
        )}
        <input
          ref={ref} // ✅ forward the ref to the actual <input>
          id={name}
          type={type}
          placeholder={placeholder}
          {...(register ? register(name) : {})} // React Hook Form support
          className={`border rounded-md p-2 focus:outline-none focus:ring-2  ${
            error ? "border-red-500 focus:ring-red-600" : "border-gray-300 focus:ring-blue-500"
          } ${className}`}
          {...rest}
        />
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
      </div>
    );
  }
);

export default Input;

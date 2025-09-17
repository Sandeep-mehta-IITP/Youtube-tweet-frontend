const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  className = "", // ye input ke liye
  wrapperClass = "", // ye wrapper ke liye
  error,
  ...rest
}) => {
  return (
    <div className={`flex flex-col ${wrapperClass}`}>
      {label && (
        <label htmlFor={name} className="mb-1 font-medium text-[#f6f5f6]">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...(register ? register(name) : {})} // React Hook Form integration
        className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Input;

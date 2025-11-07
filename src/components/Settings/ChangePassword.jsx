import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword as changePWD } from "@/app/Slices/authSlice";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const dispatch = useDispatch();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // form submission
  const handleSaveChange = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confPassword } = formData;

    // --- validations ---
    if (!oldPassword.trim())
      return toast.error("Current password is required.");
    if (!newPassword.trim()) return toast.error("New password is required.");
    if (newPassword.length < 8)
      return toast.error("New password must be at least 8 characters long.");
    if (newPassword !== confPassword)
      return toast.error("Passwords do not match.");

    try {
      const res = await dispatch(changePWD({ oldPassword, newPassword }));

      if (res.type.includes("fulfilled")) {
        
        setFormData({ oldPassword: "", newPassword: "", confPassword: "" });
      } else {
        toast.error(res?.payload?.message || "Failed to change password.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () =>
    setFormData({ oldPassword: "", newPassword: "", confPassword: "" });

  // toggle password visibility
  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <section className="flex justify-center flex-wrap gap-y-6 py-6 text-gray-100">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="text-lg font-semibold text-white mb-1">Password</h5>
        <p className="text-gray-300 text-sm">
          Please enter your current password to set a new one.
        </p>
      </div>

      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form
          onSubmit={handleSaveChange}
          className="border border-gray-700 rounded-xl bg-gray-900/30 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-5 p-6">
            {/* Current Password */}
            <div className="relative">
              <label htmlFor="oldPassword" className="block mb-1.5 text-sm">
                Current Password
              </label>
              <input
                type={showPassword.old ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your current password"
                value={formData.oldPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("old")}
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-200"
              >
                {showPassword.old ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label htmlFor="newPassword" className="block mb-1.5 text-sm">
                New Password
              </label>
              <input
                type={showPassword.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-200"
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
              <p className="mt-1 text-xs text-red-500">
                Password must be at least 8 characters long.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confPassword" className="block mb-1.5 text-sm">
                Confirm New Password
              </label>
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confPassword"
                name="confPassword"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Re-enter your new password"
                value={formData.confPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-200"
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-700 p-4 gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;

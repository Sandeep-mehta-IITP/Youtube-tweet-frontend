import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { verifyPassword, changePassword } from "@/app/Slices/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 1: verify old, 2: set new
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [showOld, setShowOld] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  // Step 1: Verify Old Password
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!oldPassword.trim()) return toast.error("Current password required");

    setLoading(true);
    const result = await dispatch(verifyPassword(oldPassword));
    setLoading(false);

    if (result.type.includes("fulfilled")) {
      toast.success("Password verified!");
      setStep(2);
    } else {
      toast.error(result.payload || "Wrong password");
    }
  };

  // Step 2: Change Password
  const handleChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password must be 8+ chars");
    if (newPassword !== confPassword) return toast.error("Passwords don't match");

    setLoading(true);
    const result = await dispatch(changePassword({ oldPassword, newPassword }));
    setLoading(false);

    if (result.type.includes("fulfilled")) {
      toast.success("Password changed successfully!");
      resetForm();
    }
  };

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfPassword("");
    setStep(1);
  };

  const goToForgotPassword = () => {
    // Navigate to forgot password page
    window.location.href = "/forgot-password";
    // Or use router: navigate("/forgot-password")
  };

  return (
    <section className="flex justify-center flex-wrap gap-y-6 py-6 text-gray-100">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="text-lg font-semibold text-white mb-1">Change Password</h5>
        <p className="text-gray-300 text-sm">
          {step === 1
            ? "Enter your current password to continue."
            : "Set a strong new password."}
        </p>
      </div>

      <div className="w-full sm:w-1/2 lg:w-2/3">
        <div className="border border-gray-700 rounded-xl bg-gray-900/30 backdrop-blur-sm p-6">
          {step === 1 ? (
            // STEP 1: Verify Old Password
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="relative">
                <label className="block mb-1.5 text-sm">Current Password</label>
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-10 text-gray-400"
                >
                  {showOld ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={goToForgotPassword}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Forgot password?
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 px-5 py-2 rounded-lg text-white hover:bg-blue-500 transition flex items-center gap-2"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  Verify
                </button>
              </div>
            </form>
          ) : (
            // STEP 2: Set New Password
            <form onSubmit={handleChange} className="space-y-5">
              <div className="relative">
                <label className="block mb-1.5 text-sm">New Password</label>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-10 text-gray-400"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
                <p className="mt-1 text-xs text-blue-400">
                  Minimum 8 characters
                </p>
              </div>

              <div className="relative">
                <label className="block mb-1.5 text-sm">Confirm Password</label>
                <input
                  type={showConf ? "text" : "password"}
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConf(!showConf)}
                  className="absolute right-3 top-10 text-gray-400"
                >
                  {showConf ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 px-5 py-2 rounded-lg text-white hover:bg-blue-500 transition flex items-center gap-2"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
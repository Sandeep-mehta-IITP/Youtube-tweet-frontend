import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { sendOTP, verifyOTP, resetPassword } from "@/app/Slices/authSlice";
import Button from "../ui/Button";
import { ArrowLeft, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Valid email required");
    setLoading(true);
    await dispatch(sendOTP(email));
    setLoading(false);
    setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    setLoading(true);
    const res = await dispatch(verifyOTP({ email, otp }));
    setLoading(false);
    if (res.type.includes("fulfilled")) {
      setToken(res.payload.token);
      setStep(3);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password too short");
    if (newPassword !== confPassword)
      return toast.error("Passwords don't match");
    setLoading(true);
    await dispatch(resetPassword({ token, newPassword }));
    setLoading(false);
    toast.success("Login with new password!");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg[#121212] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Set New Password"}
          </h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            {step === 1 && "We'll send a 6-digit code to your email"}
            {step === 2 && "Check your inbox"}
            {step === 3 && "Almost done!"}
          </p>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition flex justify-center items-center gap-2"
              >
                {loading && <FaSpinner className="animate-spin" />}
                Send OTP
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full text-center text-2xl tracking-widest py-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 text-center mt-2">
                  Didn't receive?{" "}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-400 hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition flex justify-center items-center gap-2"
              >
                {loading && <FaSpinner className="animate-spin" />}
                Verify OTP
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-medium transition flex justify-center items-center gap-2"
              >
                {loading && <FaSpinner className="animate-spin" />}
                Reset Password
              </button>
            </form>
          )}

          <div className="mt-6 text-center flex flex-col sm:flex-row gap-5 justify-between items-center">
            <Button className="px-5 py-1.5 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 group">
              <LogIn className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              <Link to="/login">Go to Login</Link>
            </Button>
            <Button
              variant="outline"
              className="px-5 py-1.5 text-lg font-semibold rounded-xl border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center gap-3 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span
                onClick={() => window.history.back()}
                className="cursor-pointer"
              >
                Go Back
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

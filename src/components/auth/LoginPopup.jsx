import React, { useState, useRef, useImperativeHandle, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/Validation/loginSchema";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/app/Slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

function LoginPopup({ route, message = "Login to Continue..." }, ref) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dialogRef = useRef();
  const [showPopup, setShowPopup] = useState(false);

  const { loading, isAuthenticated } = useSelector(({ auth }) => auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useImperativeHandle(ref, () => ({
    open() {
      setShowPopup(true);
    },
    close() {
      handleClose();
    },
  }));

  // Prevent background scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
      dialogRef.current?.showModal();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPopup]);

  // Auto-close when logged in
  useEffect(() => {
    if (isAuthenticated && showPopup) handleClose();
  }, [isAuthenticated, showPopup]);

  const handleLogin = async (data) => {
    const response = await dispatch(
      loginUser({ identifier: data.identifier, password: data.password })
    );

    if (loginUser.fulfilled.match(response)) {
      reset();
      if (route) navigate(route);
      handleClose();
    }
  };

  const handleClose = () => {
    dialogRef.current?.close();
    reset();
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="mx-auto mt-24 w-[90%] sm:w-[60%] lg:w-[40%] xl:w-[28%] bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a] rounded-2xl p-8 text-white backdrop:backdrop-blur-md shadow-2xl border border-gray-700/40"
    >
      <div className="relative flex flex-col items-center gap-5">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Logo + Heading */}
        <Logo width="w-16 h-16" className="mb-1" />
        <h2 className="text-2xl font-bold text-center tracking-wide">{message}</h2>
        <p className="text-gray-400 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-full flex flex-col gap-4"
        >
          <Input
            label="Username or Email"
            placeholder="Enter your username or email"
            name="identifier"
            register={register}
            error={errors.identifier?.message}
            className="text-black text-base sm:text-lg font-medium"
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              name="password"
              register={register}
              error={errors.password?.message}
              className="text-black text-base sm:text-lg font-medium"
            />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate("/forgot-password");
                }}
                className="text-sm text-blue-400 hover:text-blue-500 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-x-4 mt-3">
            <Button
              type="button"
              onClick={handleClose}
              className="bg-black/30 hover:bg-black/40 text-white w-1/2 border border-gray-700/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
    </dialog>,
    document.getElementById("popup-models")
  );
}

export default React.forwardRef(LoginPopup);

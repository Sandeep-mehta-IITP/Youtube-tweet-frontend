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

  useEffect(() => {
    if (showPopup) dialogRef.current.showModal();
  }, [showPopup]);

  useEffect(() => {
    if (isAuthenticated && showPopup) {
      handleClose();
    }
  }, [isAuthenticated, showPopup]);

  const handleLogin = (data) => {
    const response = dispatch(
      loginUser({ identifier: data.identifier, password: data.password })
    );

    if (loginUser.fulfilled.match(response)) {
      reset();
      if (route) navigate(route);
      handleClose();
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    reset();
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="mx-auto mt-32 w-[90%] sm:w-[60%] lg:w-[40%] xl:w-[30%] bg-[#464444] rounded-2xl p-6 text-white overflow-y-auto backdrop:backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <Logo width="w-16 h-16" className="mb-1" />
        <h2 className="text-2xl font-bold text-center">{message}</h2>
        <p className="text-gray-400 text-sm text-center mb-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>

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

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            register={register}
            error={errors.password?.message}
            className="text-black text-base sm:text-lg font-medium"
          />

          <div className="flex  items-center justify-center gap-x-5">
            <Button
              type="button"
              onClick={handleClose}
              className="bg-black/20 hover:bg-black/30 text-white w-1/2"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="w-1/2">
              Log in
            </Button>
          </div>
        </form>
      </div>
    </dialog>,
    document.getElementById("popup-models")
  );
}

export default React.forwardRef(LoginPopup);

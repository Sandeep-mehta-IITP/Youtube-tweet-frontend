import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/Validation/loginSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/app/Slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector(({ auth }) => auth);

  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const response = await dispatch(
      loginUser({
        identifier: data.identifier,
        password: data.password,
      })
    );

    if (loginUser.fulfilled.match(response)) {
      reset();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full fixed inset-0 flex flex-col items-center justify-start bg-black text-white px-4 md:px-0 mb-20">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mt-28 mb-3 text-center">
        Login your Account
      </h1>

      {/* Greeting div */}
      <div className="w-full sm:max-w-md bg-gray-900 shadow-lg rounded-2xl p-2 mb-8">
        <p className="text-gray-400 text-wrap text-sm sm:text-base text-center">
          Welcome Back!🎊
        </p>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:max-w-md flex flex-col gap-4 sm:gap-6 relative"
      >
        {/* Username or Email */}
        <Input
          label="Username or Email"
          placeholder="Enter your username or email"
          name="identifier"
          register={register}
          error={errors.identifier?.message}
          className="text-[#fff] text-base sm:text-lg font-medium bg-gray-100 bg-opacity-15"
        />

        {/* Password field with eye icon */}
        <div className="relative">
          <Input
            label="Password"
            placeholder="Enter your password"
            name="password"
            type={showPass ? "text" : "password"}
            register={register}
            error={errors.password?.message}
            className="text-[#fff] text-base sm:text-lg font-medium bg-gray-100 bg-opacity-15 pr-10"
            wrapperClass="mb-0"
          />

          {/* Eye icon container */}
          <div className="absolute right-3 top-10 text-gray-400 hover:text-white cursor-pointer">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <Button type="submit" isLoading={loading}>
          Log in
        </Button>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-medium text-blue-400 hover:text-blue-500 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </form>

      {/* Signup link */}
      <p className="mt-4 text-[#f6f5f6] font-medium text-base sm:text-lg text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

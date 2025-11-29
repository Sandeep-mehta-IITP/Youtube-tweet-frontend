import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/Validation/signupSchema";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/app/Slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("fullName", data.fullName);
      formData.append("password", data.password);

      if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);
      if (data.coverImage?.[0])
        formData.append("coverImage", data.coverImage[0]);

      const result = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(result)) {
        reset();
        navigate("/");
      }
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#000] text-white px-4 md:px-0">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mt-10 mb-3 text-center">
        Create your Account
      </h1>

      {/* Greeting div */}
      <div className="w-full sm:max-w-md bg-gray-900 shadow-lg rounded-2xl p-2 mb-8">
        <p className="text-gray-400 text-sm sm:text-base text-center">
          Welcome! Fill in your details to get started 🎊
        </p>
      </div>

      {/* Signup form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:max-w-md flex flex-col gap-4 sm:gap-6"
        encType="multipart/form-data" // ✅ required for image upload
      >
        {/* Username */}
        <Input
          label="Username"
          placeholder="Enter your username"
          name="username"
          register={register}
          error={errors.username?.message}
          className="text-[#fff] text-base sm:text-lg font-medium bg-gray-100 bg-opacity-15 pr-10"
        />

        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          name="fullName"
          register={register}
          error={errors.fullName?.message}
          className="text-[#fff] text-base sm:text-lg font-medium bg-gray-100 bg-opacity-15 pr-10"
        />

        {/* Email */}
        <Input
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email" // ✅ Corrected type
          register={register}
          error={errors.email?.message}
          className="text-[#fff] text-base sm:text-lg font-medium bg-gray-100 bg-opacity-15 pr-10"
        />

        {/* Password */}
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

        {/* Profile Image -> avatar */}
        <Input
          label="Avatar"
          name="avatar"
          type="file"
          register={register}
          error={errors.avatar?.message}
          accept="image/*"
          className="text-[#fff] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 hover:file:cursor-pointer"
        />

        {/* Cover Image */}
        <Input
          label="Cover Image"
          name="coverImage"
          type="file"
          register={register}
          error={errors.coverImage?.message}
          accept="image/*"
          className="text-[#fff] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 hover:file:cursor-pointer"
        />

        {/* Sign up button */}
        <Button type="submit" isLoading={loading} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>

      {/* Login link */}
      <p className="mt-8 text-[#f6f5f6] font-medium text-base sm:text-lg text-center mb-10">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

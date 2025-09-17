import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/Validation/signupSchema";
import { RegisterUser } from "@/API/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const navigate = useNavigate();

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

      console.log("Signup Data:", Object.fromEntries(formData));

      const response = await RegisterUser(formData);

      console.log("User signed up successfully:", response.data);
      toast.success("Signup successful! 🎉");
      reset();
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error.userMessage);
      toast.error(error.userMessage || "Signup failed! ❌");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-black text-white px-4 md:px-0 mb-20">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mt-10 mb-3 text-center">
        Create your Account
      </h1>

      {/* Greeting div */}
      <div className="w-full sm:max-w-md bg-gray-900 shadow-lg rounded-2xl p-2 mb-8">
        <p className="text-gray-400 text-wrap text-sm: sm:text-base text-center">
          Welcome! Fill in your details to get started 🎊
        </p>
      </div>

      {/* Signup form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:max-w-md flex flex-col gap-4 sm:gap-6"
      >
        {/* Username */}
        <Input
          label="Username"
          placeholder="Enter your username"
          name="username"
          register={register}
          error={errors.username?.message}
          className="text-[#000] text-base sm:text-lg font-medium"
        />

        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          name="fullName"
          register={register}
          error={errors.fullName?.message}
          className="text-[#000] text-base sm:text-lg font-medium"
        />

        {/* Email */}
        <Input
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="text"
          register={register}
          error={errors.email?.message}
          className="text-[#000] text-base sm:text-lg font-medium"
        />

        {/* Password */}
        <Input
          label="Password"
          placeholder="Enter your password"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
          className="text-[#000] text-base sm:text-lg font-medium"
        />

        {/* Profile Image -> avatar */}
        <Input
          label="Avatar"
          name="avatar"
          type="file"
          register={register}
          error={errors.avatar?.message}
          accept="image/*"
        />

        {/* Cover Image */}
        <Input
          label="Cover Image"
          name="coverImage"
          type="file"
          register={register}
          error={errors.coverImage?.message}
          accept="image/*"
        />

        {/* Sign up btuuon */}
        <Button type="submit" isLoading={isSubmitting}>
          Sign Up
        </Button>
      </form>

      {/* Login link */}
      <p className="mt-4 text-[#f6f5f6] font-medium text-base sm:text-lg text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

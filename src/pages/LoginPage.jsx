import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/Validation/loginSchema";
import { LoginUser } from "@/API/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await LoginUser({
        identifier: data.identifier,
        password: data.password,
      });

      console.log("User logged in successfully:", response.data);
      toast.success("Login successful! 🎉");
      reset();
      navigate("/");
    } catch (error) {
      console.log("Login failed:", error.userMessage);
      toast.error(error.userMessage || "Login failed! ❌");
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
        <p className="text-gray-400 text-wrap text-sm: sm:text-base text-center">
          Welcome Back!🎊
        </p>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:max-w-md flex flex-col gap-4 sm:gap-6"
      >
        {/* Username or Email */}
        <Input
          label="Username or Email"
          placeholder="Enter your username or email"
          name="identifier"
          register={register}
          error={errors.identifier?.message}
          className="text-black text-base sm:text-lg font-medium"
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

        {/* Sign up btuuon */}
        <Button type="submit" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      {/* Login link */}
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

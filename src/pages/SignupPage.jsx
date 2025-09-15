import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/Validation/signupSchema";
import { motion } from "framer-motion";
import { RegisterUser } from "@/API/api";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(signupSchema) });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("fullName", data.fullName);
    formData.append("password", data.password);
    if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);
    if (data.coverImage?.[0]) formData.append("coverImage", data.coverImage[0]);

    console.log("Signup Data:", Object.fromEntries(formData));

    const response = await RegisterUser(formData);

    if (response.success) {
      console.log("User signed up successfully:", response.data);
    } else {
      console.error("Signup failed:", response.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start">
      {/* Heading */}
      <h1 className="text-3xl font-bold mt-10 mb-3 text-center">
        Create your Account
      </h1>

      {/* Greating div */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-2">
        <p className="text-gray-500 text-center">
          Yahan form fields add karne ke liye space ready hai 🚀
        </p>
      </div>

      {/* Signup form data*/}
    </div>
  );
}

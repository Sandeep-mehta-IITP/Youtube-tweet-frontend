import React from "react";
import * as yup from "yup";


export const signupSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  fullName: yup
    .string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  avatar: yup
    .mixed()
    .required("Profile picture is required")
    .test(
      "fileSize",
      "File size too large (max 5MB)",
      (value) => value && value[0] && value[0].size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Unsupported file type",
      (value) =>
        value &&
        value[0] &&
        ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
    ),
  coverImage: yup
    .mixed()
    .nullable()
    .test(
      "fileSize",
      "File size too large (max 5MB)",
      (value) => !value || !value[0] || value[0].size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Unsupported file type",
      (value) =>
        !value ||
        !value[0] ||
        ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
    ),
});

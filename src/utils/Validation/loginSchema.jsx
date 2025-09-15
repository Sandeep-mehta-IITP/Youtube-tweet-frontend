import * as yup from "yup";

export const loginSchema = yup.object().shape({
  identifier: yup
    .string()
    .required("Username or email is required")
    .test("is-valid", "Enter a valid username or email", (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
      return emailRegex.test(value) || usernameRegex.test(value);
    }),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

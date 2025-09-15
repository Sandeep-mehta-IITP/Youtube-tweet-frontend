import { axiosInstance } from "./axiosInstance";

export const RegisterUser = async (formData) => {
  try {
    const response = await axiosInstance.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Override default JSON header
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Signup API Error:", error);
    const message =
      error.response?.data?.message || "Something went wrong during signup";
    return { success: false, message };
  }
};
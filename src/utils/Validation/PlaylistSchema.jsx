import * as yup from "yup";

export const playlistSchema = yup.object().shape({
  name: yup
    .string()
    .required("Title is required!!!")
    .min(3, "Title must be at least 3 characters")
    .max(70, "Title cannot exceed 70 characters")
    .matches(
      /^[a-zA-Z0-9 _-]+$/,
      "Title can only contain letters, numbers, spaces, underscores, and hyphens"
    ),
  description: yup
    .string()
    .required("Description is required!!!")
    .max(500, "Description cannot exceed 500 characters"),
});

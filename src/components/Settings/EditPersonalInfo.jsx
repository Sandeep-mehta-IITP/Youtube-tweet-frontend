import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../app/Slices/authSlice";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";

function EditPersonalInfo({ userData }) {
  const defaultValues = {
    firstname: userData?.fullName?.split(" ")[0] || "",
    lastname: userData?.fullName?.split(" ")[1] || "",
    email: userData?.email || "",
  };

  const [data, setData] = useState(defaultValues);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChange = async (e) => {
    e.preventDefault();

    if (!data.firstname.trim() || !data.lastname.trim())
      return toast.error("First and last name are required.");
    if (!data.email.trim()) return toast.error("Email is required.");

    const formData = {
      fullName: `${data.firstname} ${data.lastname}`,
      email: data.email,
    };

    try {
      await dispatch(updateProfile(formData));
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => setData(defaultValues);

  const isUnchanged = JSON.stringify(data) === JSON.stringify(defaultValues);

  return (
    <div className="flex flex-wrap justify-center gap-y-6 py-6 text-gray-100">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="text-lg font-semibold">Personal Info</h5>
        <p className="text-gray-400 text-sm">
          Update your photo and personal details.
        </p>
      </div>

      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form
          onSubmit={handleSaveChange}
          className="rounded-lg border border-gray-700 bg-gray-900/40 p-4"
        >
          <div className="flex flex-wrap gap-y-4">
            <div className="w-full lg:w-1/2 lg:pr-2">
              <label htmlFor="firstname" className="mb-1 inline-block text-sm">
                First name
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={data.firstname}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
              />
            </div>

            <div className="w-full lg:w-1/2 lg:pl-2">
              <label htmlFor="lastname" className="mb-1 inline-block text-sm">
                Last name
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={data.lastname}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-transparent px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
            </div>

            <div className="w-full">
              <label htmlFor="email" className="mb-1 inline-block text-sm">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-700 bg-transparent py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MdEmail className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-700 pt-4 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUnchanged}
              className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUnchanged}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPersonalInfo;

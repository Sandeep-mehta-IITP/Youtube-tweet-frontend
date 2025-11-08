import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../app/Slices/authSlice";
import { toast } from "react-toastify";
import { MdEmail, MdEdit } from "react-icons/md";

function EditPersonalInfo({ userData }) {
  const defaultValues = {
    firstname: userData?.fullName?.split(" ")[0] || "",
    lastname: userData?.fullName?.split(" ")[1] || "",
    email: userData?.email || "",
  };

  const [data, setData] = useState(defaultValues);
  const [isEditing, setIsEditing] = useState(false);
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

    const result = await dispatch(updateProfile(formData));
  };

  const handleCancel = () => {
    setData(defaultValues);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);

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
        <div className="rounded-lg border border-gray-700 bg-gray-900/40 p-6">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center mb-6">
            <h6 className="text-lg font-medium">Your Details</h6>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition"
              >
                <MdEdit size={16} />
                Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSaveChange} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5">First name</label>
                <input
                  type="text"
                  name="firstname"
                  value={data.firstname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border ${
                    isEditing
                      ? "border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500"
                      : "border-gray-700 bg-gray-800/50 cursor-not-allowed"
                  } px-3 py-2.5 text-white transition`}
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm mb-1.5">Last name</label>
                <input
                  type="text"
                  name="lastname"
                  value={data.lastname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border ${
                    isEditing
                      ? "border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500"
                      : "border-gray-700 bg-gray-800/50 cursor-not-allowed"
                  } px-3 py-2.5 text-white transition`}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1.5">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border pl-10 pr-3 py-2.5 ${
                    isEditing
                      ? "border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500"
                      : "border-gray-700 bg-gray-800/50 cursor-not-allowed"
                  } text-white transition`}
                  placeholder="email@example.com"
                />
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUnchanged}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPersonalInfo;

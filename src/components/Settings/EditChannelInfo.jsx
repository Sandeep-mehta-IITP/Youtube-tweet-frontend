import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLink,
  removeLink,
  updateLink,
  updateProfile,
} from "../../app/Slices/authSlice";
import { MdEdit, MdLink, MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

function EditChannelInfo({ userData }) {
  const dispatch = useDispatch();
  const { userData: user } = useSelector((state) => state.auth);

  const defaultValues = useMemo(
    () => ({
      username: userData?.username || "",
      description: userData?.description || "",
      links: userData?.links || [],
    }),
    [userData]
  );

  const [data, setData] = useState(defaultValues);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.links) {
      setData((prev) => ({ ...prev, links: user.links }));
    }
  }, [user]);

  const isUnchanged = useMemo(() => {
    return (
      data.username === defaultValues.username &&
      data.description === defaultValues.description
    );
  }, [data, defaultValues]);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = {};

    if (defaultValues.username !== data.username)
      formData.username = data.username;
    if (defaultValues.description !== data.description)
      formData.description = data.description;

    if (Object.keys(formData).length === 0) return;

    const res = await dispatch(updateProfile(formData));
  };

  const handleCancel = () => {
    setData(defaultValues);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);

  return (
    <div className="flex flex-wrap justify-center gap-y-6 py-6 text-gray-100">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="text-lg font-semibold">Channel Info</h5>
        <p className="text-gray-400 text-sm">
          Update your channel details and external links.
        </p>
      </div>

      <div className="w-full sm:w-1/2 lg:w-2/3">
        <div className="rounded-xl border border-gray-700 bg-gray-900/40 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h6 className="text-xl font-medium">Channel Details</h6>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition"
              >
                <MdEdit size={16} />
                Edit Info
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm mb-2">Username</label>
              <div className="flex rounded-lg border border-gray-600 overflow-hidden">
                <span className="bg-gray-800 px-4 py-3 text-gray-400 text-sm">
                  youtube-tweet.com/
                </span>
                <input
                  type="text"
                  value={data.username}
                  onChange={(e) =>
                    setData({ ...data, username: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`flex-1 bg-transparent px-4 py-3 outline-none transition ${
                    isEditing
                      ? "text-white focus:ring-2 focus:ring-blue-500"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  placeholder="@username"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                rows={4}
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                disabled={!isEditing}
                maxLength={275}
                className={`w-full rounded-lg border ${
                  isEditing
                    ? "border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500"
                    : "border-gray-700 bg-gray-800/50 cursor-not-allowed"
                } px-4 py-3 text-white resize-none transition`}
                placeholder="Tell viewers about your channel..."
              />
              <p className="mt-1 text-xs text-gray-400">
                {275 - data.description.length} characters left
              </p>
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
                  className="px-6 py-2.5 rounded-lg text-white bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>

          {/* External Links (Read-Only View) */}
          {/* <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h6 className="text-lg font-medium flex items-center gap-2">
                <MdLink /> External Links
              </h6>
              <span className="text-sm text-gray-400">
                {data.links?.length || 0} links
              </span>
            </div>

            {data.links?.length > 0 ? (
              <div className="space-y-3">
                {data.links.map((link) => (
                  <div
                    key={link._id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div>
                      <p className="font-medium text-blue-400">{link.name}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-blue-400 underline"
                      >
                        {link.url}
                      </a>
                    </div>
                    <MdLink className="text-gray-500" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No external links added yet.
              </p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default EditChannelInfo;

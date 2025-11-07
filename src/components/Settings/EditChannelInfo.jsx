import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLink,
  removeLink,
  updateLink,
  updateProfile,
} from "../../app/Slices/authSlice";

function EditChannelInfo({ userData }) {
  const dispatch = useDispatch();
  const { userData: user } = useSelector((state) => state.auth); // ✅ Redux se updated user
  //console.log("user" , user);

  // Default initial values
  const defaultValues = useMemo(
    () => ({
      username: userData?.username || "",
      description: userData?.description || "",
      links: userData?.links || [],
    }),
    [userData]
  );

  const [data, setData] = useState(defaultValues);

  
  useEffect(() => {
    if (user && user.links) {
      setData((prev) => ({
        ...prev,
        links: user.links,
      }));
    }
  }, [user]);

  // Deep compare function
  const isDataUnchanged = useMemo(() => {
    return (
      data.username === defaultValues.username &&
      data.description === defaultValues.description
    );
  }, [data, defaultValues]);

  // Handle Save Change
  const handleSaveChange = async (e) => {
    e.preventDefault();
    const formData = {};

    if (defaultValues.username !== data.username)
      formData.username = data.username;
    if (defaultValues.description !== data.description)
      formData.description = data.description;

    if (Object.keys(formData).length === 0) return;

    const res = await dispatch(updateProfile(formData));
    if (res.type !== "auth/updateProfile/rejected") {
      setData((prev) => ({
        ...prev,
        ...res.payload,
      }));
    }
  };

  // Handle Cancel
  const handleCancel = () => setData(defaultValues);

  // Handle link add/update
  const handleLink = async (e) => {
    e.preventDefault();
    const form = e.target;
    const linkId = form.dataset.linkId;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      url: formData.get("url"),
    };

    let res;
    if (linkId) {
      res = await dispatch(updateLink({ linkId, formData: payload }));
    } else {
      res = await dispatch(addLink({ formData: payload }));
    }

    // console.log("Link Response:", res);

    if (res.type.endsWith("/fulfilled") && res.payload?.links) {
      setData((prev) => ({
        ...prev,
        links: res.payload.links,
      }));
    }
  };

  // Handle delete link
  const handleDeleteLink = async (linkId) => {
    const res = await dispatch(removeLink({ linkId }));
    //console.log("delete link response", res);

    if (res.type.endsWith("/fulfilled") && res.payload?.links) {
      setData((prev) => ({
        ...prev,
        links: res.payload.links,
      }));
    }
  };

  //console.log("links", data.links);
  return (
    <div className="flex flex-wrap justify-center gap-y-4 mt-6">
      {/* Left section */}
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold text-lg">Channel Info</h5>
        <p className="text-gray-400 text-sm">
          Update your Channel details and external links.
        </p>
      </div>

      {/* Right section */}
      <div className="w-full sm:w-1/2 lg:w-2/3">
        {/* Main Info Form */}
        <form
          onSubmit={handleSaveChange}
          className="rounded-lg border border-gray-600/30"
        >
          <div className="flex flex-wrap gap-y-4 p-4">
            {/* Username */}
            <div className="w-full">
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium"
              >
                Username
              </label>
              <div className="flex rounded-lg border border-gray-600/30">
                <span className="flex shrink-0 items-center border-r border-gray-600 px-3 text-gray-400">
                  youtube-tweet.com/
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full bg-transparent px-2 py-1.5 outline-none"
                  placeholder="@username"
                  value={data.username}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="w-full">
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="w-full rounded-lg border border-gray-600/30 bg-transparent px-2 py-1.5 outline-none"
                value={data.description}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Channel Description"
                maxLength={275}
              />
              <p className="mt-0.5 text-sm text-gray-400">
                {275 - data.description.length} characters left
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <hr className="border-gray-600/40" />
          <div className="flex items-center justify-end gap-4 p-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isDataUnchanged}
              className="rounded-lg border border-gray-600 px-3 py-1.5 text-gray-300 hover:bg-white/10 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDataUnchanged}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-black font-medium hover:bg-blue-600 disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </form>

        {/* External Links Section */}
        {/* <div className="rounded-lg border border-gray-600/30 mt-6 p-4">
          <h6 className="text-lg font-semibold mb-3">External Links</h6>

          {[0, 1, 2].map((i) => {
            const link = data.links[i];
            console.log("link", link);
            
            return (
              <form
                key={i}
                data-link-id={link?._id || ""}
                onSubmit={handleLink}
                className="flex flex-wrap items-end gap-2 border-b border-gray-700/40 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0"
              >
                <label className="w-full sm:w-auto text-base font-medium">
                  Link {i + 1}
                </label>

                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter link name"
                    required
                    defaultValue={link?.name || ""}
                    className="flex-1 rounded-lg border border-gray-600/30 bg-transparent px-2 py-1 outline-none"
                  />
                  <input
                    type="url"
                    name="url"
                    placeholder="Enter URL"
                    required
                    defaultValue={link?.url || ""}
                    className="flex-1 rounded-lg border border-gray-600/30 bg-transparent px-2 py-1 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-[#ae7aff] px-3 py-1 text-black font-medium hover:bg-[#c9a7ff]"
                  >
                    {link ? "Update" : "Add"}
                  </button>

                  {link && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link?._id)}
                      className="rounded-md border border-gray-500 px-3 py-1 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            );
          })}
        </div> */}
      </div>
    </div>
  );
}

export default EditChannelInfo;

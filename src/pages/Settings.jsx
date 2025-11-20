import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaEye } from "react-icons/fa";
import {
  updateCoverImage,
  updateAvatar as uploadAvatar,
} from "@/app/Slices/authSlice";
import ChangePassword from "@/components/Settings/ChangePassword";
import EditChannelInfo from "@/components/Settings/EditChannelInfo";
import EditPersonalInfo from "@/components/Settings/EditPersonalInfo";

const Settings = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Handlers ---
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);

    const formData = new FormData();
    formData.append("coverImage", file);
    dispatch(updateCoverImage({ data: formData }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);

    const formData = new FormData();
    formData.append("avatar", file);
    dispatch(uploadAvatar({ data: formData }));
  };

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 text-white">
      {/* --- Cover Image --- */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-lg">
        <img
          src={coverFile ? URL.createObjectURL(coverFile) : userData?.coverImage}
          alt={`${userData?.username || "user"} cover`}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />

        {/* Cover Upload Button */}
        <label
          htmlFor="cover-image"
          className="absolute bottom-4 right-4 cursor-pointer rounded-full bg-white/80 p-3 text-blue-600 shadow-md hover:bg-white transition-all duration-200"
          title="Upload new cover"
        >
          <span className="flex items-center justify-center">
            <FaCloudUploadAlt className="h-7 w-7 " />
          </span>
          <input
            type="file"
            id="cover-image"
            name="coverImage"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </label>
      </div>

      {/* --- Profile Section --- */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap items-center gap-4 pb-4 pt-6">
          {/* Avatar Upload */}
          <div className="relative -mt-12 h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-gray-400 bg-gray-800">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : userData?.avatar}
              alt={`${userData?.username || "user"} avatar`}
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-all duration-200 cursor-pointer"
              title="Upload new avatar"
            >
              <FaCloudUploadAlt className="h-6 w-6 text-white" />
              <input
                type="file"
                id="avatar-upload"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          {/* Channel Metadata */}
          <div className="mr-auto">
            <h1 className="font-bold text-xl">{userData?.fullName}</h1>
            <p className="text-sm text-gray-400">@{userData?.username}</p>
          </div>

          {/* View Channel Button */}
          <button
            onClick={() => navigate(`/channel/${userData?.username}`)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
          >
            <FaEye size={18} /> View Channel
          </button>
        </div>

        {/* --- Profile Tabs --- */}
        <ul className="no-scrollbar sticky top-[66px] z-[5] flex gap-x-3 overflow-x-auto border-b border-gray-700 bg-[#121212] py-3 sm:top-[82px]">
          {[
            { id: 0, name: "Personal Information" },
            { id: 1, name: "Channel Information" },
            { id: 2, name: "Change Password" },
          ].map((tab) => (
            <li key={tab.id} className="flex-1 min-w-[150px]">
              <button
                onClick={() => setCurrentTab(tab.id)}
                className={`block w-full text-center rounded-t-lg px-3 py-2 font-medium transition-all duration-200 ${
                  currentTab === tab.id
                    ? "bg-white text-black border-b-2 border-blue-500"
                    : "text-blue-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>

        {/* --- Dynamic Tabs Content --- */}
        <div className="mt-4">
          {currentTab === 0 && <EditPersonalInfo userData={userData} />}
          {currentTab === 1 && <EditChannelInfo userData={userData} />}
          {currentTab === 2 && <ChangePassword userData={userData} />}
        </div>
      </div>
    </section>
  );
};

export default Settings;
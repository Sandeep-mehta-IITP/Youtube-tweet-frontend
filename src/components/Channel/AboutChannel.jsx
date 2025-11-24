import { getAboutChannel } from "@/app/Slices/userSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Mail, Globe, Video, Eye, Twitter } from "lucide-react";
import { formatDate } from "@/utils/helpers/formatFigure";

const AboutChannel = ({ owner = false }) => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const aboutChannel = useSelector((state) => state.user.channelAbout);
  const channelId = useSelector((state) => state.user?.userData?._id);
  const currentUserId = useSelector((state) => state.auth?.userData?._id);

  useEffect(() => {
    const id = owner ? currentUserId : channelId;
    if (id) dispatch(getAboutChannel(id));
  }, [dispatch, username, owner, currentUserId, channelId]);

  // 🦴 Skeleton Loader
  if (!aboutChannel) {
    return (
      <div className="p-6 mt-4 w-full mx-auto rounded-xl bg-[#1a1a1a]/70 border border-[#2d2d2d] shadow-md animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-500/30"></div>
          <div className="flex-1">
            <div className="w-48 h-5 mb-3 rounded-lg bg-slate-500/30"></div>
            <div className="w-32 h-4 rounded-lg bg-slate-500/30"></div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="w-3/4 h-5 rounded-lg bg-slate-500/30"></div>
          <div className="w-2/3 h-5 rounded-lg bg-slate-500/30"></div>
          <div className="w-5/6 h-5 rounded-lg bg-slate-500/30"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-500/30"></div>
                <div className="w-40 h-5 rounded-lg bg-slate-500/30"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  //  About Channel Section
  return (
    <div className="text-white px-8 py-6 rounded-2xl backdrop-blur-md shadow-lg border border-[#2d2d2d] hover:border-blue-500/60 transition-all duration-300 mt-5  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 border-b border-gray-800 pb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          @{aboutChannel.username}
        </h2>
        <span className="text-sm text-gray-400 mt-2 sm:mt-0">
          Joined{" "}
          <span className="text-gray-200 font-medium">
            {formatDate(aboutChannel.createdAt)}
          </span>
        </span>
      </div>

      {/* Description */}
      {aboutChannel.description && (
        <p className="text-gray-300 leading-relaxed mb-6 text-[15px]">
          {aboutChannel.description}
        </p>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center bg-[#232323]/60 p-3 rounded-lg border border-[#2b2b2b]">
          <Video className="w-6 h-6 text-sky-600 font-semibold" />
          <span className="mt-1 text-sm text-gray-300">
            <span className="font-semibold text-gray-100">
              {aboutChannel.totalVideos}
            </span>{" "}
            Videos
          </span>
        </div>
        <div className="flex flex-col items-center bg-[#232323]/60 p-3 rounded-lg border border-[#2b2b2b]">
          <Eye className="w-6 h-6 text-sky-600 font-semibold" />
          <span className="mt-1 text-sm text-gray-300">
            <span className="font-semibold text-gray-100">
              {aboutChannel.totalViews}
            </span>{" "}
            Views
          </span>
        </div>
        <div className="flex flex-col items-center bg-[#232323]/60 p-3 rounded-lg border border-[#2b2b2b]">
          <Twitter className="w-6 h-6 text-sky-600 font-semibold" />
          <span className="mt-1 text-sm text-gray-300">
            <span className="font-semibold text-gray-100">
              {aboutChannel.totalTweets}
            </span>{" "}
            Tweets
          </span>
        </div>
      </div>

      {/* Details */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-100">Contact</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-gray-300">
            <Mail className="w-6 h-6 text-sky-600 font-semibold" />
            <a
              href={`mailto:${aboutChannel.email}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {aboutChannel.email}
            </a>
          </li>

          <li className="flex items-center gap-3 text-gray-300">
            <Globe className="w-6 h-6 text-sky-600 font-semibold" />
            <a
              href={`/user/${aboutChannel.username}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {`https://youtube-tweet/user/${aboutChannel.username}`}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutChannel;

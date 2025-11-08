import { Search } from "lucide-react";
import React, { useState } from "react";
import AdminVideoLayout from "./AdminVideoLayout";

const AdminPanelVideos = ({ channelVideos = null }) => {
  const [filteredVideos, setFilteredVideos] = useState(null);

  if (!channelVideos) {
    const skeletonRows = Array.from({ length: 3 }); // 3 rows of skeletons

    return (
      <>
        {/* Search Bar Skeleton */}
        <div className="flex items-start mb-4">
          <div className="relative w-full max-w-2xl overflow-hidden">
            <input
              disabled
              className="w-full animate-pulse bg-gray-400/10 border py-1.5 pl-8 pr-3 outline-none sm:py-2 rounded-md"
            />
          </div>
          <div className="border rounded-r-xl px-3 py-1 animate-pulse bg-gray-400/10">
            <div className="size-6 sm:size-8 flex items-center"></div>
          </div>
        </div>

        {/* Skeleton Table */}
        <div className="w-full overflow-auto">
          <table className="w-full min-w-[1200px] border-collapse border text-white">
            <thead>
              <tr className="h-11">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <th
                    key={idx}
                    className="border-b h-4 bg-slate-100/5 p-4 animate-pulse"
                  ></th>
                ))}
              </tr>
            </thead>

            <tbody>
              {skeletonRows.map((_, rowIdx) => (
                <tr key={rowIdx} className="border border-gray-700">
                  {/* Publish Toggle */}
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-7 w-14 rounded-full bg-gray-300/20 animate-pulse"></div>
                  </td>

                  {/* Publish Status */}
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-7 w-20 rounded-full bg-gray-300/20 animate-pulse"></div>
                  </td>

                  {/* Thumbnail + Title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-300/20 animate-pulse"></div>
                      <div className="h-6 w-64 rounded bg-gray-300/20 animate-pulse"></div>
                    </div>
                  </td>

                  {/* Upload Date */}
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-6 w-24 rounded bg-gray-300/20 animate-pulse"></div>
                  </td>

                  {/* Views */}
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-6 w-20 rounded bg-gray-300/20 animate-pulse"></div>
                  </td>

                  {/* Comments */}
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-6 w-12 rounded bg-gray-300/20 animate-pulse"></div>
                  </td>

                  {/* Likes / Dislikes */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <div className="h-7 w-20 rounded-xl bg-green-300/20 animate-pulse"></div>
                      <div className="h-7 w-20 rounded-xl bg-red-300/20 animate-pulse"></div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <div className="h-7 w-7 rounded bg-gray-300/20 animate-pulse"></div>
                      <div className="h-7 w-7 rounded bg-gray-300/20 animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  const handleInputChange = (input) => {
    if (!input.trim()) {
      setFilteredVideos(channelVideos);
      return;
    }

    const filtered = channelVideos.filter((video) =>
      video.title.toLowerCase().startsWith(input.toLowerCase().trim())
    );

    setFilteredVideos(filtered);
  };

  let videos = filteredVideos || channelVideos;

  return (
    <>
      {/* Search Bar */}
      <div className="flex items-start">
        <div className="relative w-full max-w-lg">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 transition-colors peer-focus:text-blue-600"
            size={20}
          />
          <input
            type="text"
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search..."
            className="w-full peer rounded-xl border border-gray-300 bg-transparent py-2 pl-10 pr-3 text-sm text-white placeholder-gray-400 outline-none transition duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Video Manipulation Table */}
      <div className="w-full overflow-auto">
        <table className="w-full min-w-[1200px] border-collapse border text-white">
          <thead>
            <tr>
              <th className="border-collapse border-b p-4">Status</th>
              <th className="border-collapse border-b p-4">Status</th>
              <th className="border-collapse border-b p-4">Video</th>
              <th className="border-collapse border-b p-4">Date uploaded</th>
              <th className="border-collapse border-b p-4">Views</th>
              <th className="border-collapse border-b p-4">Comments</th>
              <th className="border-collapse border-b p-4">Ratings</th>
              <th className="border-collapse border-b p-4">Options</th>
            </tr>
          </thead>
          <tbody>
            {videos?.map((video) => (
              <AdminVideoLayout key={video._id} video={video} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPanelVideos;

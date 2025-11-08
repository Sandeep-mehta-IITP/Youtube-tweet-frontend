import React from "react";
import { X, Image } from "lucide-react"; // ✅ using lucide-react icons

function EditVideo() {
  return (
    <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
      {/* Overlay */}
      <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
        {/* Modal Box */}
        <div className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-5 shadow-xl">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-xl font-semibold text-white">
              Edit Video
              <span className="block text-sm text-gray-400 font-normal">
                Update your video details and thumbnail.
              </span>
            </h2>
            <button
              className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Thumbnail Upload */}
          <label
            htmlFor="thumbnail"
            className="mb-1 inline-block text-gray-200 font-medium"
          >
            Thumbnail <sup className="text-red-500">*</sup>
          </label>

          <label
            htmlFor="thumbnail"
            className="relative mb-4 block cursor-pointer border border-dashed border-gray-600 rounded-lg p-2 hover:bg-gray-800 transition-all"
          >
            <input type="file" className="sr-only" id="thumbnail" />
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7775641/pexels-photo-7775641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="State Management with Redux"
                className="rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <Image className="w-8 h-8 text-white" />
              </div>
            </div>
          </label>

          {/* Title & Description */}
          <div className="mb-6 flex flex-col gap-y-4">
            <div className="w-full">
              <label
                htmlFor="title"
                className="mb-1 inline-block text-gray-200 font-medium"
              >
                Title <sup className="text-red-500">*</sup>
              </label>
              <input
                id="title"
                type="text"
                className="w-full border border-gray-600 rounded-md bg-transparent px-2 py-1 text-white outline-none focus:border-blue-500 transition-colors"
                defaultValue="State Management with Redux"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="desc"
                className="mb-1 inline-block text-gray-200 font-medium"
              >
                Description <sup className="text-red-500">*</sup>
              </label>
              <textarea
                id="desc"
                className="h-40 w-full resize-none border border-gray-600 rounded-md bg-transparent px-2 py-1 text-white outline-none focus:border-blue-500 transition-colors"
                defaultValue={`
                    State Management with Redux is a comprehensive guidebook that delves into the
                    principles and practices of managing application state in JavaScript-based web
                    development. It explores the Redux library, providing insights and best practices
                    for managing data flow effectively.`
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="border border-gray-600 text-gray-300 rounded-md px-4 py-3 hover:bg-gray-700 transition-all">
              Cancel
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-3 transition-all">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditVideo;

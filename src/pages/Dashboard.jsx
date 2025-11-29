import { getChannelStats, getChannelVideos } from "@/app/Slices/dashboardSlice";
import AdminPanelVideos from "@/components/Dashboard/AdminPanelVideos";
import ChannelState from "@/components/Dashboard/ChannelState";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { channelStats, channelVideos } = useSelector(
    ({ dashboard }) => dashboard?.data
  );

  //console.log("dashboard stats", channelStats);
  //console.log(channelVideos);

  useEffect(() => {
    dispatch(getChannelStats());
    dispatch(getChannelVideos());
  }, [dispatch]);

  // Improved Skeleton Loader Component
  if (!channelStats && !channelVideos)
    return (
      <div className="size-full text-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
          {/* Welcoming Header */}
          <div className="flex flex-wrap justify-between gap-4">
            <div className="block">
              <h1 className="w-64 h-6 rounded bg-gray-300/65 animate-pulse font-bold"></h1>
              <p className="w-96 h-6 mt-2 rounded bg-gray-300/65 animate-pulse"></p>
            </div>

            {/* Upload Button Skeleton */}
            <div className="block">
              <div className="inline-flex w-36 h-12 items-center gap-x-2 bg-gray-300/65 rounded animate-pulse px-3 py-2 font-semibold text-black"></div>
            </div>
          </div>

          {/* Channel States */}
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="border rounded bg-gray-300/10 animate-pulse p-4"
              >
                <div className="mb-4 block h-16"></div>
                <h6 className="text-gray-300 h-8"></h6>
                <p className="h-8"></p>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-start">
            <div className="relative w-full max-w-2xl overflow-hidden">
              <input
                className="w-full animate-pulse bg-gray-400/10 border py-1 pl-8 pr-3 outline-none sm:py-2"
                disabled
              />
            </div>
            <div className="border rounded-r-xl px-3 py-1 animate-pulse bg-gray-400/10">
              <div className="size-6 sm:size-8 flex items-center"></div>
            </div>
          </div>

          {/* Video Table Skeleton */}
          <div className="w-full overflow-auto">
            <table className="w-full min-w-[1200px] border-collapse border text-white">
              <thead>
                <tr className="h-11">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <th
                      key={idx}
                      className="border-b h-4 w-7 bg-slate-100/5 p-4 animate-pulse"
                    ></th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="group border">
                    {/* Publish Toggle */}
                    <td className="border-b border-gray-600 px-4 py-3">
                      <div className="flex justify-center">
                        <span className="inline-block border h-7 w-14 rounded-2xl bg-gray-200/50 animate-pulse mt-2"></span>
                      </div>
                    </td>

                    {/* Publish Label */}
                    <td className="border-b border-gray-600 px-4 py-3">
                      <div className="flex justify-center">
                        <span className="inline-block bg-slate-50/30 animate-pulse rounded-2xl w-20 h-8"></span>
                      </div>
                    </td>

                    {/* Thumbnail & Title */}
                    <td className="border-b border-gray-600 px-4 py-3">
                      <div className="flex items-center gap-4">
                        <span className="h-10 w-10 rounded-full bg-slate-50/30 animate-pulse"></span>
                        <h3 className="w-64 h-7 bg-slate-50/30 animate-pulse rounded"></h3>
                      </div>
                    </td>

                    {/* Upload Date */}
                    {Array.from({ length: 2 }).map((_, i) => (
                      <td
                        key={i}
                        className="border-b text-center border-gray-600 px-4 py-3"
                      >
                        <div className="w-24 h-7 bg-slate-50/30 animate-pulse rounded"></div>
                      </td>
                    ))}

                    {/* Views */}
                    <td className="border-b text-center border-gray-600 px-4 py-3">
                      <div className="w-10 h-7 bg-slate-50/30 animate-pulse rounded"></div>
                    </td>

                    {/* Like / Dislike */}
                    <td className="border-b border-gray-600 px-4 py-3">
                      <div className="flex justify-center gap-4">
                        <span className="inline-block w-20 h-8 rounded-xl bg-green-200/50 animate-pulse"></span>
                        <span className="inline-block w-20 h-8 rounded-xl bg-red-200/50 animate-pulse"></span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="border-b border-gray-600 px-4 py-3">
                      <div className="flex gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-7 w-7 animate-pulse bg-slate-50/30 rounded"
                          ></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

  return (
    channelStats && (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8 pb-20">
        <ChannelState channelStates={channelStats} />
        <AdminPanelVideos channelVideos={channelVideos} />
      </div>
    )
  );
};

export default Dashboard;

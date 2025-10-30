import { clearWatchHistory, watchHistory } from "@/app/Slices/authSlice";
import GuestComponent from "@/components/GuestPages/GuestComponent";
import VideoList from "@/components/Video/VideoList";
import { Trash2, History } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const WatchHistory = () => {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector(({ auth }) => auth);

  useEffect(() => {
    dispatch(watchHistory()).unwrap();
  }, [dispatch]);

  const deleteWatchHistory = () => {
    dispatch(clearWatchHistory()).unwrap();
  };

  console.log("userdata in history", userData);

  const videos = userData?.watchHistory || [];
  console.log("videos in watchHistory", videos);

  const isHistoryEmpty = !loading && videos.length < 1;
  return (
    <>
      <section className="w-full">
        {!isHistoryEmpty && !loading && (
          <div className="flex items-center justify-center p-3">
            <button
              className="flex items-center gap-2 px-5 py-1.5 
             bg-red-600 hover:bg-red-700 
             text-white text-sm font-semibold rounded-full 
             shadow-sm hover:shadow-md transition duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={deleteWatchHistory}
            >
              <Trash2 className="w-4 h-4 text-white" />
              Clear Watch History
            </button>
          </div>
        )}

        <ul className="w-full flex flex-col gap-4">
          {!isHistoryEmpty && <VideoList videos={videos} loading={loading} />}
          {isHistoryEmpty && (
            <GuestComponent
              title="Empty Video History"
              description="You have no previously saved history."
              icon={<History className="w-12 h-12" />}
              guest={false}
            />
          )}
        </ul>
      </section>
    </>
  );
};

export default WatchHistory;

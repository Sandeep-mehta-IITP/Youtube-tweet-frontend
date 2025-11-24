import { getLikedVideos } from "@/app/Slices/likeSlice";
import GuestComponent from "@/components/GuestPages/GuestComponent";
import VideoList from "@/components/Video/VideoList";
import { ThumbsUpIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const LikedVideos = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    dispatch(getLikedVideos()).then((res) => {
      //console.log("liked videos response", res.payload);

      setVideos(res.payload);
      setLoading(false);
    });
  }, [dispatch]);

  const isLikedVideosEmpty = !loading && videos.length < 1;
  return (
    <>
      {!isLikedVideosEmpty && <VideoList videos={videos} loading={loading} />}
      {isLikedVideosEmpty && (
        <GuestComponent
          title="Empty Liked Video"
          description="You have no previously Liked Videos."
          icon={<ThumbsUpIcon className="w-12 h-12 text-sky-600 font-bold" />}
          guest={false}
        />
      )}
    </>
  );
};

export default LikedVideos;

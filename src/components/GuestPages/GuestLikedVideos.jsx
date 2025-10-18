import React from "react";
import GuestComponent from "./GuestComponent";
import { ThumbsUp } from "lucide-react";


function GuestLikedVideos() {
  return (
    <GuestComponent
      title="Save your favorite moments"
      description=" Discover new videos you'll love by signing in and liking them."
      icon={<ThumbsUp className="h-5 w-5 text-white/80 font-semibold"/>}
    />
  );
}
export default GuestLikedVideos;
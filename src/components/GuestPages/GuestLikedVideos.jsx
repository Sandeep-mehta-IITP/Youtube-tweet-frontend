import React from "react";
import GuestComponent from "./GuestComponent";
import { ThumbsUp } from "lucide-react";


function GuestLikedVideos() {
  return (
    <GuestComponent
      title="Save your favorite moments"
      description=" Discover new videos you'll love by signing in and liking them."
      icon={<ThumbsUp className="h-12 w-12 text-sky-600 font-semibold"/>}
    />
  );
}
export default GuestLikedVideos;
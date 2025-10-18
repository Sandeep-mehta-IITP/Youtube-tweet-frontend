import React from "react";
import GuestComponent from "./GuestComponent";
import { Twitter } from "lucide-react";

function GuestTweets() {
  return (
    <GuestComponent
      title="Explore What's Happening Now by Tweets"
      subtitle="See the latest conversations and trending topics. Share your voice!"
      icon={<span className="p-4 w-full">{<Twitter className="h-5 w-5 text-white/80 font-semibold"/>}</span>}
    />
  );
}
export default GuestTweets;

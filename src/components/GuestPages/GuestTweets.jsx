import React from "react";
import GuestComponent from "./GuestComponent";
import { Twitter } from "lucide-react";

function GuestTweets() {
  return (
    <GuestComponent
      title="Explore What's Happening Now by Tweets"
      description="See the latest conversations and trending topics. Share your voice!"
      icon={<span className="p-4 w-full">{<Twitter className="h-12 w-12 text-sky-600 font-semibold"/>}</span>}
    />
  );
}
export default GuestTweets;

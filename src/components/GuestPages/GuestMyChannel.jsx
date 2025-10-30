import React from "react";
import GuestComponent from "./GuestComponent";
import { VideoIcon } from "lucide-react";

function GuestMyChannel() {
  return (
    <GuestComponent
      title="Create Your Own Channel"
      description="Share your voice with the world. Sign in to get started."
      icon={<span className="w-full h-full flex items-center p-2"><VideoIcon className="h-12 w-12 text-sky-600 font-semibold"/></span>}
      route="/"
    />
  );
}

export default GuestMyChannel;
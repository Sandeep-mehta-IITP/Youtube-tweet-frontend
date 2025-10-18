import React from "react";
import GuestComponent from "./GuestComponent";
import { MonitorPlay } from "lucide-react";

function GuestSubscription() {
  return (
    <GuestComponent
      title="Subscribe to Stay Updated"
      subtitle="Sign in to Sign in to follow creators and see updates from your favorite channels."
      icon={<MonitorPlay className="h-5 w-5 text-white/80 font-semibold"/>}
    />
  );
}

export default GuestSubscription;

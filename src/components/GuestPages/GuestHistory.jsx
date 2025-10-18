import React from "react";
import GuestComponent from "./GuestComponent";
import { HistoryIcon } from "lucide-react";

function GuestHistory() {
  return (
    <GuestComponent
      title="Keep track of what you watch"
      description="Watch history isn't viewable when signed out."
      icon={<HistoryIcon className="h-5 w-5 text-white/80 font-semibold" />}
    />
  );
}

export default GuestHistory;

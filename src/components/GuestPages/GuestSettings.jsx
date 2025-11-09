import React from "react";
import GuestComponent from "./GuestComponent";
import { Settings } from "lucide-react";

function GuestSettings() {
  return (
    <GuestComponent
      title="Manage Your Profile Settings"
      description="Customize preferences, notifications, and privacy options to make the app work your way."
      icon={
        <span className="p-4 w-full">
          {<Settings className="h-12 w-12 text-sky-600 font-semibold" />}
        </span>
      }
    />
  );
}
export default GuestSettings;

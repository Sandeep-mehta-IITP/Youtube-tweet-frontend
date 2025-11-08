import React from "react";
import GuestComponent from "./GuestComponent";
import { User2Icon } from "lucide-react";

const GuestAdmin = () => {
  return (
    <GuestComponent
      title="Manage your content with ease"
      description="Sign in to access moderation tools and channel settings."
      icon={<User2Icon className="h-12 w-12 text-sky-600 font-semibold"/>}
    />
  );
};

export default GuestAdmin;

import React from "react";

function StatusLayout({ title, value, icon }) {
  return (
    <div className="border p-4">
      <div className="mb-4 block">
        <span className="inline-block h-8 w-9 rounded-full bg-[#454546] p-1 text-blue-500 font-semibold">
         <span className="flex justify-center items-center">
           {icon}
         </span>
        </span>
      </div>
      <h6 className="text-gray-300">{title}</h6>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}

export default StatusLayout;


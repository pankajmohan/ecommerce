import React from 'react';
import { X } from "lucide-react";

function RightSidebar({ children, onClose }) {
  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg border-l z-50">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="font-semibold text-lg">Right Sidebar</h3>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default RightSidebar;

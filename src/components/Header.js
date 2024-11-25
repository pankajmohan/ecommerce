import React from 'react';
import { Menu } from "lucide-react";

function Header({ toggleSidebar }) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-white shadow-sm">
      <button
        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
      {/* <h1 className="text-lg font-semibold">Dashboard</h1>
       */}<img
       src="https://img.logoipsum.com/243.svg"
       
       alt=""
     />
      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}

export default Header;

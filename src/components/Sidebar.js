import React, { createContext, useState } from 'react';
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";

export const SidebarContext = createContext({
  expanded: true, // Default value
});

function Sidebar({ children, isSidebarOpen }) {
  // const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-white border-r shadow-sm transition-all ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${isSidebarOpen ? "w-32" : "w-0"}`}
            alt=""
          />
          {/* <button
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            onClick={() => setExpanded((curr) => !curr)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button> */}
        </div>
        <SidebarContext.Provider value={{ isSidebarOpen }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t flex p-3 items-center">
          <img src="" className="w-10 h-10 rounded-md" alt="" />
          <div
            className={`flex items-center overflow-hidden transition-all ${
              isSidebarOpen ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;

import React, { createContext } from 'react';
import {  MoreVertical } from "lucide-react";

export const SidebarContext = createContext({
  expanded: true, // Default value
});

function Sidebar({ children, isSidebarOpen }) {
  // const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen" >
     <nav
  className={`h-full flex-shrink-0 bg-white border-r shadow-sm transition-all ${
    isSidebarOpen ? "w-64" : "w-16"
  }`}
>

        <div className="p-4 pb-2 flex justify-between items-center text-center">
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

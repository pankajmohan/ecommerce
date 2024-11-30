import React, { useContext } from 'react';
import { SidebarContext } from './Sidebar';
import { useLocation,NavLink } from 'react-router-dom';
function SidebarItem({ icon, text, alert, onClick, to }) {
  const { isSidebarOpen } = useContext(SidebarContext);

  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink to={to} className="side-bar-link">
    <li
      className={` overflow-hidden 
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group 
        ${
          isActive
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
      `} 
      onClick={onClick}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
            isSidebarOpen ? "w-32 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            isSidebarOpen ? "" : "top-2"
          }`}
        />
      )}

      {!isSidebarOpen && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-0 -translate-x-3 transition-all 
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50`}
        >
          {text}
        </div>
      )}
    </li>
    </NavLink>
  );
}

export default SidebarItem;

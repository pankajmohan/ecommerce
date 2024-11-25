import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import SidebarItem from './components/SidebarItem';
import RightSidebar from './components/RightSidebar';

import { Boxes, BarChart3, UserCircle, Package, Receipt, Settings, LifeBuoy } from "lucide-react";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Layout */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen}>
          <SidebarItem icon={<BarChart3 />} text="Statistics" active />
          <SidebarItem icon={<UserCircle />} text="Users" />
          <SidebarItem icon={<Boxes />} text="Inventory" />
          <SidebarItem icon={<Package />} text="Orders" alert />
          <SidebarItem icon={<Receipt />} text="Billings" />
          <hr className="my-3" />
          <SidebarItem
            icon={<Settings />}
            text="Settings"
            onClick={toggleRightSidebar} // Open Right Sidebar
          />
          <SidebarItem icon={<LifeBuoy />} text="Help" />
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Right Sidebar */}
        {isRightSidebarOpen && (
          <RightSidebar onClose={toggleRightSidebar}>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <p>Here you can add settings-related content or forms.</p>
            </div>
          </RightSidebar>
        )}
      </div>
    </div>
  );
}

export default App;

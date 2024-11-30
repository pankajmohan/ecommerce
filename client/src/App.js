import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './components/HomePage';
import SidebarItem from './components/SidebarItem';
import RightSidebar from './components/RightSidebar';
import Protected from './components/Protected';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Boxes, PackagePlus, Package, Receipt, Settings, LifeBuoy, HomeIcon } from "lucide-react";
import ProductForm from './components/ProductForm';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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
      <BrowserRouter>
        <Header toggleSidebar={toggleSidebar} />
        <div>
        </div>
        {/* Main Layout */}
        <div className="flex flex-1 relative">
          {/* Left Sidebar */}
          <Sidebar isSidebarOpen={isSidebarOpen}>
            <SidebarItem icon={<HomeIcon />} text="Home"  to="/ecommerce"/>
            <SidebarItem icon={<PackagePlus />} text="New Product" to="/addproduct"/>
            <hr className="my-3" />
            {/* <SidebarItem
              icon={<Settings />}
              text="Settings"
              onClick={toggleRightSidebar} // Open Right Sidebar
            />
            <SidebarItem icon={<LifeBuoy />} text="Help" /> */}
          </Sidebar>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
            <Route path="/ecommerce" element={<Protected Component={HomePage} />} />
            <Route path="/addproduct" element={<Protected Component={ProductForm} />} />
            </Routes>
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
      </BrowserRouter>

    </div>
  );
}

export default App;

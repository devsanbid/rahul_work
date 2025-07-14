import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DeveloperHeader from "../components/Developercomponents/DeveloperHeader";
import DeveloperSidebar from "../components/Developercomponents/Sidebar";
import { useAuth } from "../context/AuthContext";

const DeveloperDashboardLayout = () => {
  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // For Sidebar active tab (if not using react-router NavLink)
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DeveloperHeader setIsSidebarOpen={setIsSidebarOpen} developer={user} />

      {/* Layout: Sidebar + Main Content */}
      <div className="flex pt-16"> {/* pt-16 for header height */}
        {/* Sidebar */}
        <DeveloperSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:ml-64 transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeveloperDashboardLayout;
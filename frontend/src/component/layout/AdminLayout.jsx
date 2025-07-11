import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../AdminHeader"        // Your header component
import {AdminSidebar} from "../AdminSider";       // Your sidebar component
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-gray-50">
  

      <AdminHeader setIsSidebarOpen={setIsSidebarOpen} developer={user} />



      <div className="flex pt-16"> {/* pt-16 for header height */}
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          // activeTab={activeTab}
          // setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:ml-64 transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
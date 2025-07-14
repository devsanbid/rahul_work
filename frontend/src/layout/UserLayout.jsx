import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserSlider } from "../components/Usercomponents/UserSlider";
import UserHeader from "../components/Usercomponents/UserHeader";
import { useAuth } from "./../context/AuthContext";

const UserLayout = () => {
  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader setIsSidebarOpen={setIsSidebarOpen} developer={user} />

      <div className="flex pt-16">
        {" "}
        {/* pt-16 for header height */}
        {/* Sidebar */}
        <UserSlider
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

export default UserLayout;
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import HireDeveloper from "./HireDeveloper";
import PostJob from "./PostJob";
import MyRequests from "./MyRequests";
import Profile from "./Profile";
import Payments from "./Payments";
import Notifications from "./Notifications";

const DashboardMain = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when tab changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [activeTab, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "hire-developer":
        return <HireDeveloper />;
      case "post-job":
        return <PostJob />;
      case "my-requests":
        return <MyRequests />;
      case "profile":
        return <Profile />;
      case "payments":
        return <Payments />;
      case "notifications":
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Fixed at top, full width */}
      <Header
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
      />

      {/* Content Area Below Header */}
      <div className="pt-16"> {/* Add padding-top to account for fixed header */}
        <div className="flex min-h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <div
            className={`
              fixed top-16 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
              lg:relative lg:top-0 lg:translate-x-0 lg:z-auto
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              closeSidebar={closeSidebar}
              isMobile={isMobile}
            />
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && isMobile && (
            <div
              className="fixed inset-0 top-16 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <main className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50">
              <div className="min-h-full">
                {renderActiveComponent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;

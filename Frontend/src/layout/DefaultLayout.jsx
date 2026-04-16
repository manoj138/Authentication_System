import React from "react";
import { Outlet } from "react-router-dom";
import Asidebar from "../pages/backend/Asidebar";
import Navbar from "../pages/backend/Navbar";


const DefaultLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Asidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
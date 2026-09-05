import React from "react";
import { Sidebar } from "../components/core/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="relative flex h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 bg-green-400 pt-6 pb-6 overflow-y-auto">
        <div className="mx-auto flex w-11/12 max-w-250">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

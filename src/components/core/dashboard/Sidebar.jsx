// here manage that if no user exists
import React from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { useSelector } from "react-redux";

export const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="md:flex hidden min-h-[calc(100vh-3.5rem)] min-w-52 flex-col items-center">
      <div className="w-full flex flex-col gap-y-1">
        {sidebarLinks.map((link) => {
          if (link.type && user?.role !== link.type) return null;
          return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
        })}
      </div>
    </div>
  );
};


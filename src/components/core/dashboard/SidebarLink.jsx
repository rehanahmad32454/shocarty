import React from "react";
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineInventory2 } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import useRouteMatch from "../../../hooks/useRouteMatch";
import { LuShoppingBag } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
// import { useDispatch } from "react-redux";
// import { resetProductState } from "../../../slices/productSlice";
const SidebarLink = ({ link, iconName }) => {
  // const dispatch = useDispatch();
  const Icons = {
    CgProfile,
    AiOutlinePlusCircle,
    MdOutlineInventory2,
    IoCartOutline,
    LuShoppingBag,
    FaUsers,
    IoSettingsOutline,
    FiLogOut,
  };
  const Icon = Icons[link.icon];
  return (
    <NavLink
      className={`px-8 py-1 border-l-2 ${useRouteMatch(link.path) ? "bg-yellow-300/40 text-blue-500 border-l-red-500" : "text-black border-transparent"}`}
      to={link.path}
      // onClick={() => {
      //   dispatch(resetProductState());
      // }}
    >
      <div className="flex items-center gap-x-2">
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
};

export default SidebarLink;

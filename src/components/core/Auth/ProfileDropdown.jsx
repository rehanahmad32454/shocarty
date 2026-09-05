import React, { useRef, useState } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../services/operations/authApi";

const ProfileDropdown = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useOnClickOutside(ref, () => setOpen(false));
  return (
    <div
      className="hover:cursor-pointer relative"
      onClick={() => setOpen(!open)}
    >
      <img
        className="rounded-full"
        width={35}
        height={35}
        src={user?.image}
        alt={user?.firstName}
      />
      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-y-1 absolute z-1 right-0 bg-black text-white px-2 py-1 rounded-md"
        >
          <Link
            onClick={() => setOpen(!open)}
            to="/dashboard/myprofile"
            className="cursor-pointer hover:text-blue-500 p-1 rounded-md hover:bg-gray-400"
          >
            Dashboard
          </Link>
          <div
            onClick={() => {
              setOpen(!open);
              dispatch(logout(navigate));
            }}
            className="cursor-pointer hover:text-red-500 p-1 rounded-md hover:bg-gray-400"
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

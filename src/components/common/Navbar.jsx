import React from "react";
import logo from "../../assets/Logo/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { navbarLinks } from "../../data/navbar-links";
import useRouteMatch from "../../hooks/useRouteMatch";
import useAuth from "../../hooks/useAuth";
import Profiledropdown from "../core/Auth/ProfileDropdown";
const Navbar = () => {
  const { user, checked } = useAuth();
  return (
    <div className="w-full mx-auto px-2 py-1 max-w-7xl flex justify-between text-lg font-semibold items-center outline-1">
      <Link to="/" className="h-12 w-36">
        <img
          src={logo}
          alt="logo"
          className="md:w-full w-30 h-full object-contain"
        />
      </Link>
      <div className="md:hidden">
        <GiHamburgerMenu className="text-4xl" />
      </div>
      <div className="md:flex gap-x-4 md:visible hidden">
        {navbarLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`${useRouteMatch(link.path) ? "text-blue-600" : "text-black"}`}
          >
            {link.title}
          </Link>
        ))}
      </div>
      {/* {checked && !user && (
        <div className="md:flex gap-x-4 hidden md:visible">
          <Link to="/login">
            <button className="px-2 py-1 rounded-md cursor-pointer">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-2 py-1 rounded-md cursor-pointer">
              Signup
            </button>
          </Link>
        </div>
      )}
      {!checked && (
        <div className="h-9 w-9 bg-gray-200 animate-pulse rounded-full" />
      )}
      {checked && user && <Profiledropdown />} */}
      {checked ? (
        user ? (
          <Profiledropdown />
        ) : (
          <div className="md:flex gap-x-4 hidden md:visible">
            <Link to="/login">
              <button className="px-2 py-1 rounded-md cursor-pointer">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-2 py-1 rounded-md cursor-pointer">
                Signup
              </button>
            </Link>
          </div>
        )
      ) : (
        <div className="h-9 w-9 bg-gray-200 animate-pulse rounded-full" />
      )}
    </div>
  );
};

export default Navbar;

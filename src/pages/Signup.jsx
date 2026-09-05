import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { sendOtp } from "../services/operations/authApi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Tab from "../components/common/Tab";
import { tabData } from "../data/tab-data";
import { setSignupData, setUser } from "../slices/authSlice";

const Signup = () => {
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [role, setRole] = useState(tabData[0].tabName);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleOnChange(e) {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const signUpData = {
    ...signupForm,
    role,
  };

  function validate() {
    let newError = {};
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!signupForm.email) {
      newError.email = "Email is Required";
    } else if (!emailRegex.test(signupForm.email)) {
      newError.email = "Invalid email format";
    }
    if (!signupForm.firstName || !signupForm.firstName.trim()) {
      newError.firstName = "First name is Required";
    }
    if (!signupForm.lastName || !signupForm.lastName.trim()) {
      newError.lastName = "Last name is Required";
    }
    if (!signupForm.password || !signupForm.password.trim()) {
      newError.password = "Create password is Required";
    }
    if (!signupForm.confirmPassword || !signupForm.confirmPassword.trim()) {
      newError.confirmPassword = "Confirm password is Required";
    }
    return newError;
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    // dispatch(setUser(signUpData));
    dispatch(setSignupData(signUpData));
    dispatch(sendOtp(signUpData.email, navigate));
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <form
        className="flex flex-col w-md p-4 rounded-xl gap-y-3 shadow-xl"
        onSubmit={handleOnSubmit}
      >
        <div className="flex text-2xl font-semibold justify-center">
          Let’s get started
        </div>
        <p className="text-sm text-center">
          Create your account in a few quick steps.
        </p>
        <Tab tab={tabData} field={role} setField={setRole} />
        <div className="flex justify-between flex-wrap gap-x-4 gap-y-3">
          <div className="flex flex-col flex-1 gap-y-1">
            <label>
              First Name <sup className="text-red-700">*</sup>
            </label>
            <input
              className="focus:outline-blue-600 outline rounded-md p-2"
              required
              name="firstName"
              type="text"
              placeholder="Enter first name"
              onChange={handleOnChange}
              value={signupForm.firstName}
            ></input>
            {error.firstName && (
              <span className="text-red-500 text-sm">{error.firstName}</span>
            )}
          </div>
          <div className="flex flex-col flex-1 gap-y-1">
            <label>
              Last Name <sup className="text-red-700">*</sup>
            </label>
            <input
              className="focus:outline-blue-600 outline rounded-md p-2"
              required
              name="lastName"
              type="text"
              placeholder="Enter last name"
              onChange={handleOnChange}
              value={signupForm.lastName}
            ></input>
            {error.lastName && (
              <span className="text-red-500 text-sm">{error.lastName}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <label>
            Email <sup className="text-red-700">*</sup>
          </label>
          <input
            className="focus:outline-blue-600 rounded-md outline p-2"
            required
            name="email"
            type="email"
            placeholder="Enter email address"
            onChange={handleOnChange}
            value={signupForm.email}
          ></input>
          {error.email && (
            <span className="text-red-500 text-sm">{error.email}</span>
          )}
        </div>
        <div className="flex justify-between gap-x-4 gap-y-3 flex-wrap">
          <div className="relative flex flex-col flex-1 gap-y-1">
            <label>
              Create Password <sup className="text-red-700">*</sup>
            </label>
            <input
              className="focus:outline-blue-600 rounded-md outline p-2"
              required
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              onChange={handleOnChange}
              value={signupForm.password}
            ></input>
            {error.password && (
              <span className="text-red-500 text-sm">{error.password}</span>
            )}
            {/* ${error.password ? "bottom-14" : "bottom-8"} */}
            <span
              className={`absolute hover:cursor-pointer right-2 ${error.password ? "bottom-8" : "bottom-3"} text-gray-500`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaRegEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </span>
          </div>
          <div className="relative flex flex-col flex-1 gap-y-1">
            <label>
              Confirm Password <sup className="text-red-700">*</sup>
            </label>
            <input
              className="focus:outline-blue-600 rounded-md outline p-2"
              required
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={handleOnChange}
              value={signupForm.confirmPassword}
            ></input>
            {error.confirmPassword && (
              <span className="text-red-500 text-sm">
                {error.confirmPassword}
              </span>
            )}
            <span
              className={`absolute hover:cursor-pointer right-2 ${error.confirmPassword ? "bottom-8" : "bottom-3"} text-gray-500`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaRegEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </span>
          </div>
        </div>
        <button className="mt-5 text-base w-full bg-blue-500 hover:bg-blue-400 hover:cursor-pointer rounded-md px-1 py-2">
          Signup
        </button>
        <div className="w-full flex gap-x-1 items-center justify-center p-4">
          <div className="flex-1 h-px bg-gray-400"></div>
          <div>or</div>
          <div className="flex-1 h-px bg-gray-400"></div>
        </div>
        <div className="flex justify-center gap-x-1 text-center">
          Already have an account?
          <Link className="hover:underline text-blue-400" to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;

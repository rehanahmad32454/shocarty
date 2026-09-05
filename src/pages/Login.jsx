import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setSignupData } from "../slices/authSlice";
import { login } from "../services/operations/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const { loading } = useSelector((state) => state.auth);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const { email, password } = loginForm;
  const dispatch = useDispatch();
  function handleOnChange(e) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validate() {
    let newError = {};
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!loginForm.email) {
      newError.email = "Email is Required";
    } else if (!emailRegex.test(loginForm.email)) {
      newError.email = "Invalid email format";
    }
    if (!loginForm.password || !loginForm.password.trim()) {
      newError.password = "Password is Required";
    }
    return newError;
  }

  function handleOnsubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    dispatch(login(email, password, navigate));
  }
  return (
    <div className="w-full flex px-4 justify-center items-center min-h-screen">
      <form
        className="p-4 shadow-xl flex flex-col items-center w-md max-w-7xl gap-y-4 rounded-xl"
        onSubmit={handleOnsubmit}
      >
        <div className="flex text-2xl font-semibold">Login</div>
        <p className="text-sm text-center">
          Welcome back! Please enter your details.
        </p>
        <div className="w-full flex gap-y-1 flex-col">
          <label>
            Email Address <sup className="text-red-700">*</sup>
          </label>
          <input
            className="p-2 rounded-md focus:outline-blue-600 outline"
            required
            placeholder="Enter email address"
            name="email"
            type="text"
            onChange={handleOnChange}
            value={loginForm.email}
          ></input>
          {error.email && (
            <span className="text-red-500 text-sm">{error.email}</span>
          )}
        </div>
        <div className="relative w-full flex gap-y-1 flex-col">
          <label>
            Password <sup className="text-red-700">*</sup>
          </label>
          <input
            className="pr-8 p-2 rounded-md focus:outline-blue-600 outline"
            required
            placeholder="Enter password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleOnChange}
            value={loginForm.password}
          ></input>
          {error.password && (
            <span className="text-red-500 text-sm">{error.password}</span>
          )}
          <span
            className={`absolute hover:cursor-pointer right-2 ${error.password ? "bottom-14" : "bottom-8"} text-gray-500`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} />
            )}
          </span>
          <Link
            className="text-sm text-blue-600 hover:underline text-right"
            to="/forget-password"
          >
            Forget password
          </Link>
        </div>
        <button
          disabled={loading}
          className={`text-base w-full rounded-md px-1 py-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400 hover:cursor-pointer"}`}
        >
          Login
        </button>
        <div className="w-full flex gap-x-1 items-center justify-center p-4">
          <div className="flex-1 h-px bg-gray-400"></div>
          <div>or</div>
          <div className="flex-1 h-px bg-gray-400"></div>
        </div>
        <div>
          Don't have account?{" "}
          <Link className="hover:underline text-blue-400" to="/signup">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

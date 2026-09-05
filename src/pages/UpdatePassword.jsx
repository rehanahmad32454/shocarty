import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { verifyResetToken } from "../services/operations/authApi";

const UpdatePassword = () => {
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const [updatePasswordForm, setUpdatePasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const { token: resetPasswordToken } = useParams();

  function handleOnChange(e) {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
    setUpdatePasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (!resetPasswordToken) {
    return <p>Invalid URL</p>;
  }

  function validate() {
    let newError = {};
    if (!updatePasswordForm.password || !updatePasswordForm.password.trim()) {
      newError.password = "Create password is Required";
    }
    if (
      !updatePasswordForm.confirmPassword ||
      !updatePasswordForm.confirmPassword.trim()
    ) {
      newError.confirmPassword = "Confirm password is Required";
    }
    return newError;
  }

  const { password } = updatePasswordForm;

  function handleOnSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (updatePasswordForm.password !== updatePasswordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    dispatch(verifyResetToken(resetPasswordToken, password));
  }

  return (
    <div className="min-h-screen flex justify-center items-center m-4">
      <div className="w-md flex flex-col gap-y-3 shadow-2xl p-4">
        <h1 className="text-2xl font-bold">Choose new password</h1>
        <p>Almost done. Enter your new password and you are all set</p>
        <form className="flex flex-col gap-y-3" onSubmit={handleOnSubmit}>
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
              value={updatePasswordForm.password}
            ></input>
            {error.password && (
              <span className="text-red-500 text-sm">{error.password}</span>
            )}
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
              value={updatePasswordForm.confirmPassword}
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
          <button className="mt-5 text-base w-full bg-blue-500 hover:bg-blue-400 hover:cursor-pointer rounded-md px-1 py-2">
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;

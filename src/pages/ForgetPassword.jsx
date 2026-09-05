import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { resetToken } from "../services/operations/authApi";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState({});
  const [forgetPasswordForm, setForgetPasswordForm] = useState({
    email: "",
  });

  function handleOnChange(e) {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
    setForgetPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validate() {
    let newError = {};
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!forgetPasswordForm.email) {
      newError.email = "Email is Required";
    } else if (!emailRegex.test(forgetPasswordForm.email)) {
      newError.email = "Invalid email format";
    }
    return newError;
  }

  const { email } = forgetPasswordForm;

  function handleOnSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    // setEmailSent(!emailSent);
    // console.log(forgetPasswordForm);
    dispatch(resetToken(email, setEmailSent));
    console.log(emailSent);
  }

  return (
    <div className="min-h-screen flex justify-center items-center m-4">
      <div className="w-md flex flex-col p-4 gap-y-3 shadow-2xl">
        {emailSent ? (
          <h1 className="text-2xl font-bold text-center">Check email</h1>
        ) : (
          <h1 className="text-2xl font-bold text-center">
            Reset Your Password
          </h1>
        )}
        {emailSent ? (
          <p>
            A password Reset link has been sent to your email. Please check your
            inbox and follow the instructions. if you don't see it within a few
            minutes, remember to check your spam folder
          </p>
        ) : (
          <p>
            Forgot your password? No problem. Enter your registered email
            address and we'll send you instructions to create a new password.
          </p>
        )}
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            {!emailSent && (
              <>
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
                  value={forgetPasswordForm.email}
                ></input>
              </>
            )}
            {error.email && (
              <span className="text-red-500 text-sm">{error.email}</span>
            )}
          </div>
          <button className="mt-2 text-base w-full bg-blue-500 hover:bg-blue-400 hover:cursor-pointer rounded-md px-1 py-2">
            {emailSent ? "Resend Email" : "Verify Email"}
          </button>
        </form>
        <Link className="flex items-center gap-x-1" to="/login">
          <FaArrowLeft />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;

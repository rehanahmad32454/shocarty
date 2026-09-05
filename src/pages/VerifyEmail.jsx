import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { RxCountdownTimer } from "react-icons/rx";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authSlice } from "../slices/authSlice";
import { sendOtp, signUp } from "../services/operations/authApi";
const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signupData, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [navigate]);

  function verifyAndSignup(e) {
    e.preventDefault();
    if (!signupData) {
      return;
    }
    const { firstName, lastName, email, password, role } = signupData;
    console.log(firstName, lastName, email, password, role, otp);
    dispatch(signUp(firstName, lastName, email, password, role, otp, navigate));
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-y-4 w-sm m-4">
        <h1 className="text-2xl font-bold">Verify Email</h1>
        <p>A verification code has been sent to you. Enter the code below</p>
        <form onSubmit={verifyAndSignup} className="flex flex-col">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputType="tel"
            shouldAutoFocus
            renderInput={(props) => (
              <input
                {...props}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="sm:w-12 w-11 outline-gray-200 outline-1 rounded-lg aspect-square text-center focus:outline-2 focus:outline-black"
              ></input>
            )}
            containerStyle={{
              justifyContent: "space-between",
              gap: "0 6px",
            }}
          />
          <button className="mt-5 text-base w-full bg-blue-500 hover:bg-blue-400 hover:cursor-pointer rounded-md px-1 py-2">
            Verify Email
          </button>
        </form>
        <div className="flex justify-between items-center">
          <Link to="/signup" className="flex items-center gap-x-2">
            <FaArrowLeft />
            Back to signup
          </Link>
          <div
            onClick={() => {
              if (!signupData?.email) return;
              else dispatch(sendOtp(signupData?.email, navigate));
            }}
            className="flex items-center gap-x-2 text-blue-400 cursor-pointer"
          >
            <RxCountdownTimer />
            Resend it
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

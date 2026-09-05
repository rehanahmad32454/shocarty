import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const Error = () => {
  const page = new URLSearchParams();
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-green-400">
      <div className="flex gap-x-10">
        <Link
          to={() => {
            navigate(-1);
          }}
        >
          <button className="cursor-pointer text-xl rounded-lg bg-pink-300 p-4">
            Go Back
          </button>
        </Link>
        <Link to="/">
          <button className="cursor-pointer text-xl rounded-lg bg-pink-300 p-4">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

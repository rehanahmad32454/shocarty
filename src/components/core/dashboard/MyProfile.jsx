import React from "react";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";

export const MyProfile = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="w-full">
      <h1 className="py-4 text-2xl font-medium">My Profile</h1>
      <div className="bg-amber-200 p-8 rounded-t-md">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-x-4">
            <img
              className="w-16 h-16 rounded-full"
              src={user?.image}
              alt={`${user.firstName}`}
            />
            <div className="flex flex-col">
              <div className="text-xl font-bold">{`${user?.firstName} ${user?.lastName}`}</div>
              <div>{user?.email}</div>
              <span className="w-fit px-2 py-1 rounded-3xl bg-pink-200">
                {user?.role}
              </span>
            </div>
          </div>
          <Link
            className="bg-rose-500 px-2 py-1 rounded-md flex items-center gap-x-1"
            to="/dashboard/setting"
          >
            <span className="font-medium">Edit</span>
            <MdEdit size={20} />
          </Link>
        </div>
      </div>
      <div className="bg-white p-8 rounded-b-md">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-4">
            <div className="text-xl font-bold">About</div>
            <div className="bg-gray-100 px-2 py-4 rounded-md">
              {user?.additionalDetails?.about
                ? user?.additionalDetails?.about
                : "Write something about yourself"}
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="text-xl font-bold">Personal Details</div>
            <div className="flex gap-x-4 justify-between">
              <div className="flex-1 bg-gray-100 px-2 py-4 rounded-md">
                <div className="text-gray-500">FIRST NAME</div>
                <div>{user?.firstName}</div>
              </div>
              <div className="flex-1 bg-gray-100 px-2 py-4 rounded-md">
                <div className="text-gray-500">LAST NAME</div>
                <div>{user?.lastName}</div>
              </div>
            </div>
            <div className="flex gap-x-4 justify-between">
              <div className="flex-1 bg-gray-100 px-2 py-4 rounded-md">
                <div className="text-gray-500">EMAIL</div>
                <div>{user?.email}</div>
              </div>
              <div className="flex-1 bg-gray-100 px-2 py-4 rounded-md">
                <div className="text-gray-500">CONTACT NUMBER</div>
                {user?.additionalDetails?.contactNumber
                  ? user?.additionalDetails?.contactNumber
                  : "Add contact number"}
              </div>
            </div>
            <div className="flex gap-4 justify-between">
              <div className="flex-1 bg-gray-100 px-2 py-4 rounded-md">
                <div className="text-gray-500">GENDER</div>
                <div>
                  {user?.additionalDetails?.gender
                    ? user?.additionalDetails?.gender
                    : "Add gender"}
                </div>
              </div>
              <div className="flex-1 bg-gray-100 px-2 py-4 rounded-md">
                <div className="text-gray-500">DATE OF BIRTH</div>
                <div>
                  {user?.additionalDetails?.dateOfBirth
                    ? user?.additionalDetails?.dateOfBirth
                    : "Add date of birth"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

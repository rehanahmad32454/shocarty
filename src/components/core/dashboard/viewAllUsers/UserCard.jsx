import React, { useState } from "react";
import { dateFormatter } from "../../../../utils/dateFormatter";
import { FaBan, FaUser } from "react-icons/fa";
import { ConfirmationModal } from "../../../common/ConfirmationModal";
import {
  blockUser,
  unBlockUser,
} from "../../../../services/operations/authApi";
export const UserCard = ({
  _id: userId,
  firstName,
  lastName,
  email,
  image,
  createdAt,
  role,
  isBlocked,
  setRefresh,
}) => {
  const [confimationModal, setConfirmationModal] = useState(null);
  const [Loading, setLoading] = useState(false);
  console.log(firstName, lastName);
  // const handleBlockUser = async (userId) => {
  //   console.log("before block");

  //   await blockUser(userId);

  //   console.log("after block");

  //   setRefresh((prev) => {
  //     console.log("prev =", prev);
  //     return prev + 1;
  //   });
  //   setConfirmationModal(null);
  // };
  const handleBlockUser = async (userId) => {
    try {
      setLoading(true);
      await blockUser(userId);
      setConfirmationModal(null);
      setRefresh((prev) => prev + 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const HandleunBlockUser = async (userId) => {
    try {
      setLoading(true);
      await unBlockUser(userId);
      setRefresh((prev) => prev + 1);
      setLoading(false);
    } catch (error) {
    } finally {
      setLoading(false);
      setConfirmationModal(null);
    }
  };

  return (
    <div className="w-full flex items-center sm:flex-row flex-col gap-y-6 justify-between bg-white p-4 rounded-lg flex-wrap">
      <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
        <div className="flex sm:w-14 sm:h-14 h-20 w-20">
          <img
            className="w-full h-full object-cover rounded-full"
            src={image}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex gap-x-1 font-medium justify-center sm:justify-start">
            <div>{firstName}</div>
            <div>{lastName}</div>
          </div>
          <div>
            <div className="text-gray-600">{email}</div>
            <div className="text-gray-400 text-sm text-center sm:text-start">{`joined ${dateFormatter(createdAt)}`}</div>
          </div>
          <div className="flex items-center justify-center gap-x-4 sm:justify-start">
            <div className="px-2 py-1 rounded-md bg-blue-100 text-blue-600">
              {role}
            </div>
            <div>
              {isBlocked ? (
                <span className="px-2 py-1 rounded-md bg-red-100 text-red-600">
                  Blocked
                </span>
              ) : (
                <span className="px-2 py-1 rounded-md bg-green-100 text-green-600">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {isBlocked ? (
        <FaUser
          className="cursor-pointer text-blue-500"
          size={24}
          onClick={() => HandleunBlockUser(userId)}
        />
      ) : (
        <FaBan
          className="cursor-pointer text-amber-600"
          size={24}
          onClick={() =>
            setConfirmationModal({
              text1: "Are you sure you want to block this user ?",
              text2: "They will not be able to access their account",
              btn1Text: "Block",
              loadingText: "Processing...",
              btn2Text: "Cancel",
              btn1Handler: () => handleBlockUser(userId),
              btn2Handler: () => setConfirmationModal(null),
            })
          }
        />
      )}
      {confimationModal && <ConfirmationModal modalData={confimationModal} />}
    </div>
  );
};

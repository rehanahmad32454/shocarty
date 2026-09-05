import React, { useEffect, useState } from "react";
import { Spinner } from "../../../common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../../services/operations/userApi";
import { useSearchParams } from "react-router-dom";
import { UserCard } from "./UserCard";
import { Pagination } from "../../../common/Pagination";

export const ViewAllUsers = () => {
  const { users, totalPages, userLoading } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [refresh, setRefresh] = useState(0);
  const raw = searchParams.get("page");
  const parsed = Number(raw);
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  const dispatch = useDispatch();

  console.log("users:", users);

  useEffect(() => {
    console.log("refresh updated:", refresh);
  }, [refresh]);

  useEffect(() => {
    console.log("refresh", refresh);
    dispatch(getAllUsers(page));
  }, [page, refresh, dispatch]);

  const prevPage = () => {
    setSearchParams({ page: String(page - 1) });
  };

  const nextPage = () => {
    setSearchParams({ page: String(page + 1) });
  };

  useEffect(() => {
    const isInvalid = !Number.isInteger(parsed) || page <= 0;
    if (isInvalid) {
      setSearchParams({ page: String(1) });
    }
    if (totalPages && page > totalPages) {
      setSearchParams({ page: String(totalPages) });
    }
  }, [page, totalPages]);

  if (userLoading) {
    return <Spinner />;
  }

  return (
    !userLoading && (
      <div className="w-full flex gap-y-5 flex-col">
        {users && users.length > 0 ? (
          <>
            {users &&
              users.map((user) => (
                <UserCard key={user._id} {...user} setRefresh={setRefresh} />
              ))}
            {totalPages > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                prevPage={prevPage}
                nextPage={nextPage}
              />
            )}
          </>
        ) : (
          <h1 className="font-bold text-2xl text-center">No User Found</h1>
        )}
      </div>
    )
  );
};

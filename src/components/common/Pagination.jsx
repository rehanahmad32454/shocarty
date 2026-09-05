import React from "react";
import { useSelector } from "react-redux";

export const Pagination = ({ page, totalPages, prevPage, nextPage }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-x-1">
        {page > 1 && (
          <button
            onClick={() => prevPage(page)}
            className="bg-red px-2 py-1 bg-red-200 rounded-lg font-bold cursor-pointer text-xl"
          >
            Prev
          </button>
        )}
        {page < totalPages && (
          <button
            onClick={() => nextPage(page)}
            className="bg-red px-2 py-1 bg-red-200 rounded-lg font-bold cursor-pointer text-xl"
          >
            Next
          </button>
        )}
      </div>
      <div>{`Page ${page} of ${totalPages}`}</div>
    </div>
  );
};

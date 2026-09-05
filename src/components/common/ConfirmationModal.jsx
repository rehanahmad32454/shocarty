import React from "react";
export const ConfirmationModal = ({ modalData, Loading }) => {
  return (
    <div className="fixed flex justify-center items-center inset-0 bg-white/20 backdrop-blur-xs">
      <div className="rounded bg-amber-700 flex flex-col gap-y-4 p-4">
        <h1 className="text-2xl font-bold">{modalData?.text1}</h1>
        <p className="font-medium">{modalData.text2}</p>
        <div className="flex gap-x-4">
          <button
            className="cursor-pointer bg-blue-300 px-2 py-1 rounded-md"
            onClick={modalData?.btn1Handler}
          >
            {!Loading ? modalData.btn1Text : modalData.loadingText}
          </button>
          <button
            className="bg-blue-300 cursor-pointer px-2 py-1 rounded-md"
            onClick={modalData?.btn2Handler}
          >
            {modalData.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";

const Tab = ({ tab, field, setField }) => {
  const [currentTab, setCurrentTab] = useState(null);

  return (
    <div className="w-fit bg-gray-100 flex gap-x-1 outline rounded-full p-1">
      {tab.map((t) => (
        <div
          onClick={() => setField(t.tabName)}
          className={`cursor-pointer rounded-full px-2 py-1 transition-all duration-300 ease-in-out ${
            t.tabName === field
              ? "bg-black text-white"
              : "text-black hover:bg-gray-200"
          }`}
          key={t.id}
        >
          {t.tabName}
        </div>
      ))}
    </div>
  );
};

export default Tab;

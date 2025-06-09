"use client";

import React from "react";

const MainFilterSearchBox = () => {
  return (
    <div
      className="mainSearch -w-900 bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded-100 d-flex items-center"
      style={{ gap: "24px" }}
    >
      <div
        style={{ flex: 1 }}
        className="d-flex align-items-center flex-nowrap"
      >
        <span
          className="text-15 fw-500 ls-2 lh-16 mr-20"
          style={{ whiteSpace: "nowrap" }}
        >
          Ask AI
        </span>
        <input
          type="text"
          className="form-control text-15 text-light-1 ls-2 lh-16"
          placeholder="Ask me anything..."
          style={{
            width: "100%",
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            padding: "8px 16px",
          }}
        />
      </div>
      <button
        className="mainSearch__submit button -dark-1 h-60 px-35 rounded-100 bg-blue-1 text-white d-flex align-items-center"
        style={{ minWidth: 120 }}
      >
        <i className="icon-search text-20 mr-10" />
        Search
      </button>
    </div>
  );
};

export default MainFilterSearchBox;

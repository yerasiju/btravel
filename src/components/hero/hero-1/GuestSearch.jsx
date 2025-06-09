"use client";

import React from "react";

const GuestSearch = () => {
  return (
    <div className="searchMenu-guests px-20 py-10 border-light rounded-4 js-form-dd js-form-counters">
      <div>
        <h4 className="text-15 fw-500 ls-2 lh-16">Ask AI</h4>
        <input
          type="text"
          className="form-control text-15 text-light-1 ls-2 lh-16"
          placeholder="Ask AI"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
};

export default GuestSearch;

"use client";

import React, { useState } from "react";

const GuestSearch = () => {
  const [query, setQuery] = useState("");

  const TELEGRAM_BOT_USERNAME = "btravell_bot";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim()) {
      const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(
        query
      )}`;

      window.open(telegramUrl, "_blank");

      setQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const quickQuestions = [
    "Лучшие места для отдыха в декабре",
    "Бюджетное путешествие в Европу",
    "Маршрут по Азии на 2 недели",
    "Романтические места для пар",
  ];

  const handleQuickQuestion = (question) => {
    setQuery(question);
  };

  return (
    <div className="searchMenu-guests px-20 py-10 border-light rounded-4 js-form-dd js-form-counters">
      <form onSubmit={handleSubmit}>
        <div>
          <h4 className="text-15 fw-500 ls-2 lh-16">Ask AI Travel Assistant</h4>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <input
              type="text"
              className="form-control text-15 text-light-1 ls-2 lh-16"
              placeholder="Спросите о путешествиях на любом языке..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                flex: 1,
              }}
            />
            <button
              type="submit"
              disabled={!query.trim()}
              style={{
                background: query.trim() ? "#0088cc" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: query.trim() ? "pointer" : "not-allowed",
                fontSize: "14px",
                transition: "background-color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              🤖 Ask AI
            </button>
          </div>

          {/* Quick questions */}
          <div style={{ marginTop: "10px" }}>
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
              Быстрые вопросы:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickQuestion(question)}
                  style={{
                    background: "#f0f0f0",
                    border: "1px solid #ddd",
                    borderRadius: "15px",
                    padding: "4px 12px",
                    fontSize: "11px",
                    cursor: "pointer",
                    color: "#333",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#e0e0e0";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#f0f0f0";
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "10px", fontSize: "11px", color: "#888" }}>
            ⚡ Powered by Groq AI - самый быстрый AI для путешествий
          </div>
        </div>
      </form>
    </div>
  );
};

export default GuestSearch;

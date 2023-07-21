import React, { useEffect } from "react";
import "./FlashMessage.css";

export default function FlashMessages({ messages }) {
  return (
    <div className="floating-alerts">
      {messages.map((msg, index) => {
        return (
          <div
            key={index}
            className="alert alert-success text-center floating-alert shadow-sm"
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
}

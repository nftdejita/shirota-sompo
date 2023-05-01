import React, { useState, useRef, useEffect } from "react";
import styles from "/styles/tcg/logs.module.css";

export default function Logs({ logMessages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logMessages]);

  return (
    <div className={styles.logs}>
      {logMessages.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

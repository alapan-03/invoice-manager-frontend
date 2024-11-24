import React from "react";
// import "./Toast.css"; // Style the toast container and message

const Toast = ({ message, onClose }) => {
  return (
    <div className="toast-container">
      <div className="toast">
        <p>{message}</p>
        <button onClick={onClose} className="close-toast">×</button>
      </div>
    </div>
  );
};

export default Toast;

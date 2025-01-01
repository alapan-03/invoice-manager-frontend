// import React from "react";
// // import "./Toast.css"; // Style the toast container and message

// const Toast = ({ message, onClose }) => {
//   return (
//     <div className="toast-container">
//       <div className="toast">
//         <p>{message}</p>
//         <button onClick={onClose} className="close-toast">×</button>
//       </div>
//     </div>
//   );
// };

// export default Toast;


import React from "react";

const Toast = ({ message, onClose, type = "error" }) => {
  // Determine class based on type
  const toastClass = type === "success" ? "toast-success" : "toast-error";

  return (
    <div className="toast-container">
      <div className={`toast ${toastClass}`}>
        <p>{message}</p>
        {/* <button onClick={onClose} className="close-toast">×</button> */}
      </div>
    </div>
  );
};

export default Toast;

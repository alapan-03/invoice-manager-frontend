import useSaveToFirestore from "../../../../app/Hooks/useSaveToFirestore";
import "./DetailsPopup.css"
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./../../../../firebaseConfig";
import { useAuth } from "./../../../../AuthProvider";

// App.js
import React, { useState } from "react";

const DetailsPopup = (props) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { saveAllToFirestore} = useSaveToFirestore();

  
  async function handleSave(){
    const docId = await saveAllToFirestore("Invoices",props.invoicesSt, name, message);
    if (docId) {
      alert(`Data saved successfully with ID: ${docId}`);
    }
    else{
      alert("Error")
    }
  }

  const handleOpenPopup = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    props.showPopup(false);
  };

  console.log(props.invoicesSt)

  const handleSubmit = (e) => {
    e.preventDefault();
    props.details({name, description: message})
    alert("Form Submitted!");
    setPopupVisible(false);
    props.invoicesSt && handleSave(props.invoiceSt)
  };

  return (
    <div className="details-popup">
      {/* <button className="open-popup-btn" onClick={handleOpenPopup}>
        Open Form
      </button> */}
      {/* {isPopupVisible && ( */}
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClosePopup}>
              &times;
            </button>
            <h2>Form Popup</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}
              required />
              </label>
            
              <label>
                Message:
                <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
              </label>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      {/* )} */}
    </div>
  );
};

export default DetailsPopup;

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./Uploader.css";
// import { Pulse } from "ldrs";
import { lineWobble } from "ldrs";
import Toast from "./../../Toast";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthProvider, useAuth } from './../../../AuthProvider';
import toast, { Toaster } from "react-hot-toast";


lineWobble.register();

// Default values shown

export const showToast = (setToastMessage, message) => {
  setToastMessage(message); // Set the toast message
  setTimeout(() => setToastMessage(""), 3000); // Clear the message after 3 seconds
};



const FileUploader = ({ onUpload, userId }) => {

  const { user } = useAuth();

  let navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // State to track toast message

  const supportedFormats = [".pdf", ".jpg", ".jpeg", ".png", ".xlsx", ".xls", ".csv"]; // Supported extensions

  const onDrop = (acceptedFiles) => {
    const formData = new FormData();
    const file = acceptedFiles[0];

    const fileExtension = file?.name?.split(".")?.pop()?.toLowerCase();
    if (!supportedFormats.includes(`.${fileExtension}`)) {
      showToast(setToastMessage, "Error: The file format is not supported?.");
      return;
    }

    if(!user){



      // showToast(setToastMessage, "SignIn first!");
      toast.error("SignIn first")

      // let timeout = setTimeout(() => {
        navigate("/signin")
      // }, 1500);

      // clearTimeout(timeout)
      return;
    }

    setLoading(true);
    formData?.append("file", acceptedFiles[0]);

    // Call API
    fetch("https://invoice-manager-backend-mzys.onrender.com/upload", {
    // fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res?.ok) {
          throw new Error(`Error: ${res?.statusText}`);
        }
        return res?.json();
      })
      .then((data) => {
        console?.log("File uploaded successfully:", data);
        onUpload(data); // Pass the response data to the parent component
        setLoading(false);
      })
      .catch((error) => {
        console?.error("Upload failed:", error?.message);
        showToast(setToastMessage, "Error while uploading file...")
        setLoading(false);
      });
  };

  // const showToast = (message) => {
  //   setToastMessage(message); // Set the toast message
  //   setTimeout(() => setToastMessage(""), 3000); // Clear the message after 3 seconds
  // };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      {/* {toastMessage && <Toast message={toastMessage} />} */}

      <div>
        <Toaster />
      </div>

      <div className="file-uploader-container">
        {loading ? (
          <div className="loader-container">
            <l-line-wobble
              size="80"
              stroke="5"
              bg-opacity="0.1"
              speed="1.75"
              color="black"
            ></l-line-wobble>
            <p>Uploading your file...</p>
          </div>
        ) : (
          <div {...getRootProps()} className="file-uploader">
            <Plus size={48} color="rgb(170, 170, 170)"/>
            <input {...getInputProps()} />
            <p>Drag & drop a file here, or click to select one</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploader;

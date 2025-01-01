import React, { useState } from "react";
// import "./Signup.css";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import Toast from "./../../Toast";
import { showToast } from "../../Home/FileUploader/FileUploader";
import toast, { Toaster } from "react-hot-toast";

const Signin = (props) => {
  const navigate = useNavigate("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [toastMessage, setToastMessage] = useState(""); // State to track toast message

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");

    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
            props.userId(user.uid);
            toast.success("Signin successful");
            // alert("Signup successful!");
            navigate("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorMessage.includes("credential"))
              toast.error("Incorrect email or password");
            else toast.error(errorMessage);
            // toast.error(errorMessage)

            // showToast(setToastMessage, "Incorrect email or password!")
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="signup-container">
      <div>
        <Toaster />
      </div>
      {toastMessage && <Toast message={toastMessage} />}

      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <p>
          Don't have an account? <Link to="/signup">SignUp</Link>
        </p>

        <button type="submit" className="signup-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;

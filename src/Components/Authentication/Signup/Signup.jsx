
import React, { useState } from "react";
import "./Signup.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Signup = (props) => {

    const navigate = useNavigate("/");
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // props.userId(user.uid);
        alert("Signup successful!");
        toast.success("Signup successful")
        navigate("/signin"); // Redirect to the home page
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        if(errorMessage.includes("in-use"))
        toast.error("Email already in use, try signing in")
        // toast.error("Error while signing up")
        else
        toast.error("Error while signing up")
      });

    // Placeholder for API call or further actions
 
  };

  return (
    <div className="signup-container">
      <div>
        <Toaster />
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {/* {error && <p className="error-message">{error}</p>} */}

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

        <p>Already have an account? <Link to="/signin">Signin</Link> </p>

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home.jsx';
import SignupPage from './pages/SignupPage.jsx';
import SigninPage from './pages/SigninPage.jsx';
import { AuthProvider, useAuth } from './AuthProvider.jsx';
import Navbar from "./Components/Navbar/Navbar.jsx"
import CardsHome from './pages/CardsHome.jsx';
import CardDetails from './Components/CardDetails/CardDetails.jsx';


function App() {
  const [id, setId] = useState(null);
  
  function getId(e) {
    setId(e);
  }
  console.log(id,"dkjfdekj")

  return (
    <div className="App">
      <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<CardsHome userId={id} />} />
          <Route path="/details/:sno" element={<CardDetails/>} />
          <Route path="/upload" element={<Home userId={id} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage uId={getId} />} />
        </Routes>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;

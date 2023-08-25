import './App.css';
// import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Navbar from './Navbar';

function App() {

  return (
      <div className='App'>
      <Navbar />
      <div className='contentBox'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      {/* {!user ? ( <Login /> ) : (<Home />)} */}
      </Router>
      </div>
      </div>
  )
}


export default App;

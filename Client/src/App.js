import './App.css';
// import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Navbar from './Navbar';
import ChatRoom from './ChatRoom';

function App() {

  return (
      <Router>
      <div className='App'>
      <Navbar />
      <div className='contentBox'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id/:username" element={<ChatRoom />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      {/* {!user ? ( <Login /> ) : (<Home />)} */}
      </div>
      </div>
      </Router>
  )
}


export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PassengerHome from './PassengerHome';
import PostPage from './PostPage';
import PassengerProfile from './PassengerProfile';
import Login from './Login/Login';
import WelcomePage from './Login/WelcomePage';
import Signup from './Login/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PassengerHome />} />
          <Route path="/posts" element={<PassengerHome />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/profile/:id" element={<PassengerProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

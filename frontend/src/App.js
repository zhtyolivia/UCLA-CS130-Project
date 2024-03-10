import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import PassengerHome from './pages/Passenger/Home/PassengerHome';
import SearchResults from './pages/Passenger/Home/SearchResult';
import PostPage from './pages/Passenger/PostPage/PostPage';
import PassengerProfile from './pages/Passenger/Profile/PassengerProfile';
import PassengerLogin from './pages/Login/PassengerLogin';
import Login from './pages/Login/Login';
import WelcomePage from './pages/Login/WelcomePage';
import Signup from './pages/Login/Signup';
import DriverHome from './pages/Driver/Home/DriverHome';
import InitiateRide from './pages/Driver/InitiateRide/InitiateRide';
import PassengerPost from './pages/Passenger/PassengerPost/PassengerPost';

import axios from "axios";


const token = window.localStorage.getItem("AuthToken");
if (token) {
  axios.defaults.headers.common["authorization"] = token;
} else {
  axios.defaults.headers.common["authorization"] = null;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passenger-login" element={<PassengerLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PassengerHome />} />
          <Route path="/posts" element={<PassengerHome />} />
          <Route path="/search" element={<SearchResults />} /> 
          <Route path="/:id" element={<PostPage />} />
          <Route path="/profile/:id" element={<PassengerProfile />} />
          <Route path="/driver-home" element={<DriverHome />} />
          <Route path="/initiate-ride" element={<InitiateRide />} />
          <Route path="/passenger-post" element={<PassengerPost />} />
        </Routes>
      </div>
    </Router>


  );
}

export default App;

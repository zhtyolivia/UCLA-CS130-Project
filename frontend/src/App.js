import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import PassengerHome from './pages/Passenger/Home/PassengerHome';
import SearchResults from './pages/Passenger/Home/SearchResult';
import PostPage from './pages/Passenger/PostPage/PostPage';
import PassengerProfile from './pages/Passenger/Profile/PassengerProfile';
import PassengerLogin from './pages/Login/PassengerLogin';
import DriverLogin from './pages/Login/DriverLogin';
import WelcomePage from './pages/Login/WelcomePage';
import DriverSignup from './pages/Login/DriverSignup';
import DriverHome from './pages/Driver/Home/DriverHome';
import InitiateRide from './pages/Driver/InitiateRide/InitiateRide';
import PassengerPost from './pages/Passenger/PassengerPost/PassengerPost';
import DriverProfile from './pages/Driver/Profile/DriverProfile';


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
          <Route path="/driver-login" element={<DriverLogin />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passenger-login" element={<PassengerLogin />} />
          <Route path="/driver-signup" element={<DriverSignup />} />
          <Route path="/home" element={<PassengerHome />} />
          <Route path="/posts" element={<PassengerHome />} />
          <Route path="/search" element={<SearchResults />} /> 
          <Route path="/:id" element={<PostPage />} />
          <Route path="/profile/:id" element={<PassengerProfile />} />
          <Route path="/driver-home" element={<DriverHome />} />
          <Route path="/initiate-ride" element={<InitiateRide />} />
          <Route path="/passenger-post" element={<PassengerPost />} />
          <Route path="/driver-profile/:id" element={<DriverProfile />} />
        </Routes>
      </div>
    </Router>


  );
}

export default App;

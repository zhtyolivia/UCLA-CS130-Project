/* Part of this file was leveraged from GPT */ 
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
import NotFoundPage from './pages/Login/NotFoundPage';
import Success from './pages/Login/Success';
import DriverHome from './pages/Driver/Home/DriverHome';
import PassengerPostDetail from './pages/Driver/Home/PassengerPostDetail';
import DriverPostDetail from './pages/Driver/Home/DriverPostDetail';
import InitiateRide from './pages/Driver/InitiateRide/InitiateRide';
import PassengerPost from './pages/Passenger/PassengerPost/PassengerPost';
import DriverProfile from './pages/Driver/Profile/DriverProfile';
import PassengerSignup from './pages/Login/PassengerSignup';

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
          <Route path="/success" element={<Success />} />
          <Route path="/passenger-login" element={<PassengerLogin />} />
          <Route path="/driver-signup" element={<DriverSignup />} />
          <Route path="/passenger-signup" element={<PassengerSignup />} />
          <Route path="/home" element={<PassengerHome />} />
          <Route path="/posts" element={<PassengerHome />} />
          <Route path="/search" element={<SearchResults />} /> 
          <Route path="/driverposts/:id" element={<PostPage />} />
          <Route path="/profile/:id" element={<PassengerProfile />} />
          <Route path="/driver-home" element={<DriverHome />} />
          <Route path="/initiate-ride" element={<InitiateRide />} />
          <Route path="/passenger-post" element={<PassengerPost />} />
          <Route path="/driver-profile/:id" element={<DriverProfile />} />
          <Route path="/passenger-post/:postId" element={<PassengerPostDetail />} />
          <Route path="/driver-post-detail" element={<DriverPostDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>


  );
}

export default App;

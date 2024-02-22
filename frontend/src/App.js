import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PassengerHome from './PassengerHome';
import PostPage from './PostPage';
import PassengerProfile from './PassengerProfile';
import Login from './login/login';
import WelcomePage from './login/welcome_page';
import Signup from './login/signup';
import DriverHome from './driver/driver_home';
import InitiateRide from './driver/initialte_ride';



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
          <Route path="/driver-home" element={<DriverHome />} />
          <Route path="/initiate-ride" element={<InitiateRide />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

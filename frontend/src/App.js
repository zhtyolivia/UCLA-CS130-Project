import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PassengerHome from './pages/Passenger/Home/PassengerHome';
import PostPage from './pages/Passenger/PostPage/PostPage';
import PassengerProfile from './pages/Passenger/Profile/PassengerProfile';
import Login from './pages/Login/Login';
import WelcomePage from './pages/Login/WelcomePage';
import Signup from './pages/Login/Signup';
import DriverHome from './pages/Driver/Home/DriverHome';
import InitiateRide from './pages/Driver/InitiateRide';







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

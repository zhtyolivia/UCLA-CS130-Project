import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PassengerHome from './pages/Passenger/Home/PassengerHome';
import PostPage from './pages/Passenger/PostPage/PostPage';
import PassengerProfile from './pages/Passenger/Profile/PassengerProfile';

ReactDOM.render(
  <Router>
    <Routes>
      <Route exact path="/posts" element={<PassengerHome />} />
      <Route exact path="/" element={<PassengerHome />} />
      <Route path="/posts/:id" element={<PostPage />} /> {/* route for post page */}
      <Route path="/profile/:id" element={<PassengerProfile />} /> {/* route for PassengerProfile page */}
    </Routes>
  </Router>,
  document.getElementById('root')
);


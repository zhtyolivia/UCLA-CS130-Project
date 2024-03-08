import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the App component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PassengerHome from './pages/Passenger/Home/PassengerHome';
import PostPage from './pages/Passenger/PostPage/PostPage';
import PassengerProfile from './pages/Passenger/Profile/PassengerProfile';

ReactDOM.render(
  <React.StrictMode>
    <App /> {/* Use App component which contains the Routes */}
  </React.StrictMode>,
  document.getElementById('root')
);

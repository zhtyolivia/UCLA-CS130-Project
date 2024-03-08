import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getCurrentUserId } from '../../services/mockAPI'; 
import '../../components/Navigation/PassengerNavbar.scss';
import Notification from "../Notification";

// Import Material-UI components and icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Tooltip } from '@mui/material';


function Navigation() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);

  if (userId === null) {
    return <div>Loading...</div>; 
  }

  return (
    <nav className="p-navbar">
      <div className="p-navbar-brand">
        <Link to="/" className="p-navbar-logo">Swift Link</Link>
      </div>
      
      <div className="p-search-bar">
        <input type="text" placeholder="Search posts..." />
        <button>Search</button>
      </div>

      <ul className="p-navbar-nav">

        {/* use the DirectionsCarIcon to navigate to the home page */ }
        <Tooltip className="p-nav-item" title="Find a ride">
          <IconButton 
            aria-label="show all rides" 
            color="inherit" 
            onClick={() => {
              navigate("/home");
            }}>
              <DirectionsCarIcon />
          </IconButton>
        </Tooltip>

        {/* Notification icon */ }
        <li className="p-nav-item">
          <Notification/>
        </li>

        {/* use the AccountCircleIcon to navigate to the profile page */ }
        <Tooltip className="p-nav-item" title="Find a ride">
          <IconButton 
            aria-label="Profile" 
            color="inherit" 
            onClick={() => {
              navigate(`/profile/${userId}`);
            }}>
              <AccountCircleIcon />
          </IconButton>
        </Tooltip>


      </ul>
    </nav>
  );
}

export default Navigation;

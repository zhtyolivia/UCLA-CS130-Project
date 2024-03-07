import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUserId } from '../../services/mockAPI'; 
import './DriverNavbar.scss'; // Assuming you will create this CSS file for styling

const DriverNav = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
      getCurrentUserId().then(setUserId);
    }, []);
  
  
    if (userId === null) {
      return <div>Loading...</div>; 
    }
  
    return (
      <nav className="d-navbar">
        <div className="d-navbar-brand">
          <Link to="/" className="d-navbar-logo">Swift Link</Link>
        </div>
        
        <div className="d-search-bar">
          <input type="text" placeholder="Search posts..." />
          <button>Search</button>
        </div>
  
        <ul className="d-navbar-nav">
          <li className="d-nav-item">
            <Link to="/driver-home" className="d-nav-link">Home</Link>
          </li>
          <li className="d-nav-item">
            <Link to="/initiate-ride" className="d-nav-link">Initiate Ride</Link>
          </li>
          <li className="d-nav-item">
            {/* Ensure the profile link dynamically uses the fetched userId */}
            <Link to={`/profile/${userId}`} className="d-nav-link">Profile</Link>
          </li>
        </ul>
      </nav>
    );
  }

export default DriverNav;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUserId } from './mockAPI'; // Adjust the import path as necessary
import './Navigation.css';

function Navigation() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);

  // Optionally handle loading state if needed
  if (userId === null) {
    return <div>Loading...</div>; // Or some other loading indicator
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">Swift Link</Link>
      </div>
      
      <div className="search-bar">
        <input type="text" placeholder="Search posts..." />
        <button>Search</button>
      </div>

      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/home" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          {/* Ensure the profile link dynamically uses the fetched userId */}
          <Link to={`/profile/${userId}`} className="nav-link">Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
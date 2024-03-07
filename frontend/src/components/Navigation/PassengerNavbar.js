import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUserId } from '../../services/mockAPI'; 
import '../../components/Navigation/PassengerNavbar.scss';

function Navigation() {
  const [userId, setUserId] = useState(null);

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
        <li className="p-nav-item">
          <Link to="/home" className="p-nav-link">Home</Link>
        </li>
        <li className="p-nav-item">
          {/* Ensure the profile link dynamically uses the fetched userId */}
          <Link to={`/profile/${userId}`} className="p-nav-link">Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
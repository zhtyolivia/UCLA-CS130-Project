import React from 'react';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/" className="navbar-logo">Swift Link</a>
      </div>
      
      <div className="search-bar">
        <input type="text" placeholder="Search posts..." />
        <button>Search</button>
      </div>

      <ul className="navbar-nav">
        <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
        <li className="nav-item"><a href="/create-post" className="nav-link">Create Post</a></li>
        <li className="nav-item"><a href="/profile" className="nav-link">Profile</a></li>
      </ul>

    </nav>
  );
}

export default Navigation;

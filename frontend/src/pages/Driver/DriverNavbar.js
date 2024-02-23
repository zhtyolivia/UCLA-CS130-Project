import React from 'react';
import { Link } from 'react-router-dom';
import './DriverNavbar.css'; // Assuming you will create this CSS file for styling

const DriverNav = () => {
    return (
        <nav className="driver-nav">
            <Link to="/driver-home" className="nav-brand">SwiftLink</Link>
            <div className="nav-links">
                <Link to="/initiate-ride" className="nav-item">Initiate a Ride</Link>
                <Link to="/driver-home" className="nav-item">Home</Link>
                <Link to="/profile" className="nav-item">Profile</Link>
            </div>
        </nav>
    );
};

export default DriverNav;

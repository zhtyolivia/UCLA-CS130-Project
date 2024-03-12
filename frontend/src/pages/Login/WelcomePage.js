// WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.scss'; 

const WelcomePage = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Swift Link</h1>
                <p>Welcome to Swift Link, your go-to ridesharing app!</p>
                <div className='log-in-btn-container'>
                    <Link to="/driver-login" className="welcome-login-button">I'm a Driver</Link>
                </div>
                <div className='log-in-btn-container'>
                    <Link to="/passenger-login" className="welcome-login-button">I'm a Passenger</Link>
                </div>
                
            </div>
        </div>
    );
};

export default WelcomePage;

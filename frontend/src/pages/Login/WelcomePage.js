// WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css'; 

const WelcomePage = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Swift Link</h1>
                <p>Welcome to Swift Link, your go-to ridesharing app!</p>
                <Link to="/login" className="welcome-login-button">Login</Link>
            </div>
        </div>
    );
};

export default WelcomePage;

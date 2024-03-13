// Success.js
import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.scss'; 

const SuccessPage  = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>You're all set! </h1>
                <p>Use the following links to log into your account.</p>
                <div className='log-in-btn-container'>
                    <Link to="/login" className="welcome-login-button">Driver Login</Link>
                </div>
                <div className='log-in-btn-container'>
                    <Link to="/passenger-login" className="welcome-login-button">Passenger Login</Link>
                </div>
                
            </div>
        </div>
    );
};

export default SuccessPage;

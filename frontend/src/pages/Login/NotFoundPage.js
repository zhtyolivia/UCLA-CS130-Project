// WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.scss'; 

const NotFoundPage = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>404</h1>
                <p>Page not found </p>
                <div className='log-in-btn-container'>
                    <Link to="/welcome" className="welcome-login-button">Go back to welcome page</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;

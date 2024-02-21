import React from 'react';
import './Login.css'; // Make sure to import the CSS file
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
    return (
        <div className="login-page">
        <div className="top-stripe">
        <span className="brand-text">SwiftLink</span> 
        </div>
        <div className="login-container">
            <div className="login-card">
                <Link to="/" className="back-btn">
                    <FontAwesomeIcon icon="arrow-left" /> Back
                </Link>
                <h2>Login</h2>
                <form className="login-form">
                    <div className="input-group">
                        <input type="text" placeholder="Username" required />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" required />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                    <p className="forgot-password">Forgot password?</p>
                </form>
                <p className="sign-up-text">Don't have an account? <Link to="/signup" className="sign-up">Sign up</Link></p>
                <div className="social-login">
                    <button type="button" className="social-btn google">
                        <FontAwesomeIcon icon={faGoogle} /> Sign up using Google
                    </button>
                </div>
                <Link to="/home">Go to Home</Link>
            </div>
        </div>
        </div>
    );
};

export default Login;

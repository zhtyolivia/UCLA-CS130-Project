import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DriverSignup.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import SignupForm from '../../components/SignupForm/SignupForm.js';
import GoogleSignup from '../../components/GoogleSignup/GoogleSignup.js'; // Make sure this path is correct
import useSignup from '../../hooks/useSignup';


const DriverSignup = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleGoogleSuccess = (googleData) => {
        // Handle the successful Google signup
        console.log('Google signup successful:', googleData);
        // Here, you might send the googleData to your backend for verification
        // and then navigate to the driver's main page or dashboard
    };

    const handleGoogleFailure = (error) => {
        // Handle the Google signup failure
        console.error('Google signup failed:', error);
        // You might want to display an error message to the user
    };

    const { handleSubmit, error } = useSignup('Driver', `${API_BASE_URL}/driver/register`, '/driver-login');


    return (
        <div className="driver-signup-page">
            <div className="top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <h2>Driver Signup</h2>
                    <SignupForm onSubmit={handleSubmit} errors={errors} userRole="Driver" />
                    <div className="social-signup">
                        <GoogleSignup onSuccess={handleGoogleSuccess} onFailure={handleGoogleFailure} />
                    </div>
                    <p className="login-link">Already have an account? <Link to="/driver-login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default DriverSignup;


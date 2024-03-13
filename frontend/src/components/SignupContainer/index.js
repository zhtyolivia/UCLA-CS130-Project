// SignupContainer.js
/* Part of this file was leveraged from GPT */ 
import React from 'react';
import { Link } from 'react-router-dom';
import GoogleSignup from './GoogleSignup/GoogleSignup'; 
import SignupForm from './SignupForm/SignupForm';
import 'SignupContainer.scss';

const SignupContainer = ({ onSubmit, errors, userRole }) => {
    const handleGoogleSuccess = (googleData) => {
        console.log(`${userRole} Google signup successful:`, googleData);
    };

    const handleGoogleFailure = (error) => {
        console.error(`${userRole} Google signup failed:`, error);
    };

    return (
        <div className={`${userRole.toLowerCase()}-signup-page`}>
            <div className="top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <h2>{userRole} Signup</h2>
                    <SignupForm onSubmit={onSubmit} errors={errors} userRole={userRole} />
                    <div className="social-signup">
                        <GoogleSignup onSuccess={handleGoogleSuccess} onFailure={handleGoogleFailure} />
                    </div>
                    <p className="login-link">Already have an account? <Link to={`/${userRole.toLowerCase()}-login`}>Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignupContainer;

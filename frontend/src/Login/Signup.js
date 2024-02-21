import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Signup.css'; // Assuming you have a separate CSS file for the signup page

const Signup = () => {
    return (
        <div className="signup-page">
            <div className="top-stripe">
            <span className="brand-text">SwiftLink</span> 
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <Link to="/login" className="back-btn">
                        <FontAwesomeIcon icon="arrow-left" /> Back
                    </Link>
                    <h2>Signup</h2>
                    <form className="signup-form">
                        <div className="input-group">
                            <input type="email" placeholder="Email" required />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Password" required />
                        </div>
                        <button type="submit" className="signup-btn">Signup</button>
                        <p className="Already have an account">Already have an account? <Link to="/login" className="login">Login</Link></p>
                        <div className="divider">Or</div>
                        <button className="social-btn google">Login with Google</button>
                    </form>
                </div>
            </div>
            </div>
    );
};

export default Signup;

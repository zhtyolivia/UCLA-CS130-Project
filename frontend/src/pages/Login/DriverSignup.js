import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';import './DriverSignup.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const DriverSignup = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phonenumber: '',
        showPassword: false,
    });
    const [errors, setErrors] = useState({});

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
        setErrors({ ...errors, [prop]: '' }); // Optionally clear errors when the user starts to correct them
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (values.password !== values.confirmPassword) {
            setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/driver/register`, {
                email: values.email,
                password: values.password,
                name: values.name,
                phonenumber: values.phonenumber,
            });

            if (response.data.status === 'Success') {
                navigate('/driver-login'); // Redirect to driver's login page
            } else {
                setErrors({ ...errors, form: response.data.message }); // Handle different types of errors
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ ...errors, form: 'An error occurred during signup. Please try again.' });
        }
    };

    return (
        <div className="signup-page">
            <div className="top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <h2>Driver Signup</h2>
                    {errors.form && <div className="error-text">{errors.form}</div>}
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input type="email" placeholder="Email" value={values.email} onChange={handleChange('email')} required />
                            {errors.email && <div className="error-text">{errors.email}</div>}
                        </div>
                        <div className="input-group">
                            <input type={values.showPassword ? "text" : "password"} placeholder="Password" value={values.password} onChange={handleChange('password')} required />
                            <FontAwesomeIcon icon={values.showPassword ? faEyeSlash : faEye} onClick={handleClickShowPassword} className="password-icon" />
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Confirm Password" value={values.confirmPassword} onChange={handleChange('confirmPassword')} required />
                            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Full Name" value={values.name} onChange={handleChange('name')} required />
                            {errors.name && <div className="error-text">{errors.name}</div>}
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Phone Number" value={values.phonenumber} onChange={handleChange('phonenumber')} required />
                            {errors.phonenumber && <div className="error-text">{errors.phonenumber}</div>}
                        </div>
                        <button type="submit" className="signup-btn">Signup</button>
                    </form>
                    <div className="social-login">
                        <button type="button" className="social-btn google">
                            <FontAwesomeIcon icon={faGoogle} /> Signup with Google
                        </button>
                    </div>
                    <p className="login-link">Already have an account? <Link to="/driver-login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default DriverSignup;

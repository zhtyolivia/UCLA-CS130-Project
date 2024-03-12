import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DriverLogin.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const DriverLogin = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
    });
    const [errors, setErrors] = useState({});

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
        setErrors({ ...errors, [prop]: '' }); // Optionally clear errors
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/driver/signin`, {
                email: values.email,
                password: values.password,
            });
            if (res.data.status === 'Success') {
                window.localStorage.setItem('AuthToken', `Bearer ${res.data.token}`);
                window.location.reload();
                navigate('/driver-home'); // Navigate to the Driver Home page
            } else {
                setErrors({ ...errors, form: res.data.message });
            }
        } catch (error) {
            console.error('Error when logging in:', error);
            setErrors({ ...errors, form: 'An error occurred. Please try again.' });
        }
    };

    return (
        <div className="login-page">
            <div className="p-log-in-top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="login-container">
                <div className="login-card">
                    <Link to="/" className="back-btn">Back</Link>
                    <h2>Driver Login</h2>
                    {errors.form && <div className="error-text">{errors.form}</div>}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={values.email}
                                onChange={handleChange('email')}
                                required
                            />
                            {errors.email && <div className="error-text">{errors.email}</div>}
                        </div>
                        <div className="input-group password-group">
                            <input
                                type={values.showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={values.password}
                                onChange={handleChange('password')}
                                required
                            />
                            <FontAwesomeIcon
                                icon={values.showPassword ? faEyeSlash : faEye}
                                onClick={handleClickShowPassword}
                                className="password-icon inside"
                            />
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    <p className="sign-up-text">
                        Don't have an account? <Link to="/driver-signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DriverLogin;

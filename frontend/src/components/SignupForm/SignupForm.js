// SignupForm.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignupForm.scss'; // Adjust CSS file name as needed

const SignupForm = ({ onSubmit, errors, userRole }) => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phonenumber: '',
        showPassword: false,
    });

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        onSubmit(values); // Delegate submission logic to the parent component
    };

    return (
        <div className="signup-form-container">
            {errors.form && <div className="error-text">{errors.form}</div>}
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="email" placeholder="Email" value={values.email} onChange={handleChange('email')} required />
                    {errors.email && <div className="error-text">{errors.email}</div>}
                </div>
                <div className="input-group">
                    <input type={values.showPassword ? "text" : "password"} placeholder="Password" value={values.password} onChange={handleChange('password')} required />
                    <FontAwesomeIcon className="password-icon" icon={values.showPassword ? faEyeSlash : faEye} onClick={handleClickShowPassword} className="password-icon" />
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
                <button type="submit" className="signup-btn">Signup as {userRole}</button>
            </form>
        </div>
    );
};

export default SignupForm;


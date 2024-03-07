// src/driver/InitiateRide.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InitiateRide.scss'; // Make sure to create and import the CSS file
import DriverNav from '../../../components/Navigation/DriverNavbar'; 

const InitiateRide = () => {
    const [title, setTitle] = useState('');
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [seats, setSeats] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Process form data here, like sending it to the backend
        // After submission, navigate to another page or give feedback to the user
        navigate('/driver-home'); // Example redirection after form submission
    };
    const goBack = () => {
        navigate('/driver-home'); // Navigates back to the DriverHome page
    };

    return (
        <div >
            <DriverNav />
            <div className="initiate-ride-page">
                
                <h1>Initiate a Ride</h1>
                <form onSubmit={handleSubmit} className="initiate-ride-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Start Location"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="End Location"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Seats Available"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button type="submit">Submit Ride</button>
                </form>
            </div>
        </div>
    );
};

export default InitiateRide;

import '../../Driver/InitiateRide/InitiateRide.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import { isLoggedIn } from '../../../utils/LoginActions'; 

const PassengerPost = () => {
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

    // If the user hasn't logged in, navigate to welcome page.
    if (!isLoggedIn()) {
        return <Navigate to="/welcome" />;
    }

    return (
        <div >
            <Navigation />
            <div className="initiate-ride-page">
                
                <h1>Send a message to all drivers</h1>
                Tell the drivers about a ride you want to have.
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
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button class="passenger-button" type="submit">Submit Ride</button>
                </form>
            </div>
        </div>
    );
};

export default PassengerPost;

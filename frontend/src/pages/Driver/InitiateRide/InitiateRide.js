import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DriverNav from '../../../components/Navigation/DriverNavbar';
import './InitiateRide.scss';

// Replace the API_BASE_URL with the actual base URL of your API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const InitiateRide = () => {
    // State variables for form inputs
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [carModel, setCarModel] = useState('');
    const [seats, setSeats] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Create an object with form data
        const rideData = {
            startingLocation: startLocation,
            endingLocation: endLocation,
            startTime: new Date(startTime).toISOString(),
            licensenumber: licensePlate,
            model: carModel,
            numberOfSeats: parseInt(seats, 10),
            additionalNotes: description,
        };
    
        const token = window.localStorage.getItem('AuthToken'); // Ensure token is stored correctly in localStorage
    
        try {
            const response = await axios.post(`${API_BASE_URL}/driverpost/newpost`, rideData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token // Use token directly if it already includes "Bearer "
                }
            });
    
            console.log('Ride submitted successfully:', response.data);
            navigate('/driver-home'); // Redirect to the driver home page
        } catch (error) {
            console.error('Error submitting new ride:', error.response || error);
            // Handle different responses based on the error response status code
            if (error.response && error.response.status === 403) {
                console.error('Forbidden: This action is not allowed.');
            } else {
                console.error('Error:', error.message);
            }
        }
    };
    

    return (
        <div>
            <DriverNav />
            <div className="initiate-ride-page">
                <h1>Initiate a Ride</h1>
                <form onSubmit={handleSubmit} className="initiate-ride-form">
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
                        type="datetime-local"
                        placeholder="Start Time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="License Plate"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Car Model"
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Seats Available"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                    />
                    <textarea
                        placeholder="Additional Notes"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button className="driver-button" type="submit">Submit Ride</button>
                </form>
            </div>
        </div>
    );
};

export default InitiateRide;

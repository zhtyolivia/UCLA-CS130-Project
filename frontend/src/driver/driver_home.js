import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './driver_home.css'; // You need to create this CSS file
import DriverNav from './driver_navbar'; 

const DriverHome = () => {
    const [driverRides, setDriverRides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: Fetch the rides from the backend, this is just a placeholder
        // axios.get('/api/driverRides').then((response) => {
        //     setDriverRides(response.data);
        // });

        // Placeholder data
        setDriverRides([
            {
                id: 1,
                startLocation: 'LA',
                endLocation: 'SD',
                availableSeats: 3,
                time: 'Sun Feb 18',
                email: 'driver@example.com',
                description: 'Looking for passengers to SD.',
            },
            {
                id: 1,
                startLocation: 'Westwood',
                endLocation: 'LAX',
                availableSeats: 4,
                time: 'Mon Feb 19',
                email: 'driver@example.com',
                description: 'Looking for passengers to LAX.',
            },
            {
                id: 1,
                startLocation: 'SF',
                endLocation: 'LA',
                availableSeats: 1,
                time: 'Thu Feb 22',
                email: 'driver@example.com',
                description: 'Looking for passengers to LA.',
            },
        ]);
    }, []);

    return (
        <div className="driver-home-page">
            <DriverNav />
            <header>
                <h1>Driver Home</h1>
            </header>
            <div className="rides-listing">
                {driverRides.map((ride) => (
                    <div key={ride.id} className="ride-card">
                        <h2>Ride from {ride.startLocation} to {ride.endLocation}</h2>
                        <p>Time: {ride.time}</p>
                        <p>Seats Available: {ride.availableSeats}</p>
                        <p>Email: {ride.email}</p>
                        <p>Description: {ride.description || 'No description provided.'}</p>
                        {/* Add functionality to edit or delete rides */}
                    </div>
                ))}
            </div>
            <nav>
                <Link to="/login">Go to Login</Link>
                {/* Other navigation links if necessary */}
            </nav>
        </div>
    );
};

export default DriverHome;

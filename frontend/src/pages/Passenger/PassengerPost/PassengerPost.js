import '../../Driver/InitiateRide/InitiateRide.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import { isLoggedIn } from '../../../utils/LoginActions'; 
import axios from 'axios';
import { API_BASE_URL } from '../../../services/api';


const PassengerPost = () => {
    const [date, setDate] = useState('');
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [seats, setSeats] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const body = {
            'startingLocation': startLocation, 
            'endingLocation': endLocation, 
            'startTime': date, 
            'numberOfPeople': seats, 
            'additionalNotes': description
        }; 

        try {
            console.log(body)
            const res = await axios.post(`${API_BASE_URL}/passengerpost/newpost`, body);
            console.log(res)
            const data = res.data;
            if (data.status === 'Success') {
                console.log(data)
            } else if (data.status === 'FAILED') {
                console.log(data)
            }
        } catch(err) {
            console.error(err);
        }
        // TODO: give user some response when correctly posted
    };

    // If the user hasn't logged in, navigate to welcome page.
    if (!isLoggedIn()) {
        return <Navigate to="/welcome" />;
    }

    return (
        <div >
            <Navigation />
            <div className="initiate-ride-page">
                
                <h1>Didn't find a rideshare you want? </h1>
                Tell the drivers about your desired trip.
                <form onSubmit={handleSubmit} className="initiate-ride-form">
                    <input
                        type="text"
                        placeholder="Start Location (required)"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="End Location (required)"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Number of people you have (required)"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Date you're looking for (required)"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <textarea
                        type="text"
                        placeholder="Detailed description of your request (optional)"
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

import '../../Driver/InitiateRide/InitiateRide.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import SuccessPopup from '../../../components/SuccessPopup/SuccessPopup';
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
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
    const [showFailPopup, setShowFailPopup] = useState(false); 
    const [successMsg, setSuccessMsg] = useState(''); 
    const [failMsg, setFailMsg] = useState(''); 

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
            if (data.status === 'Success' || data.status === 'SUCCESS') {
                // console.log(data)
                // Display success message 
                setSuccessMsg('Successfully sent to drivers!'); 
                setShowSuccessPopup(true); 
                // Reset form fields 
                setDate('');
                setStartLocation('');
                setEndLocation('');
                setSeats('');
                setDescription('');
            } else if (data.status === 'FAILED') {
                setShowFailPopup(true); 
                setFailMsg('At least one required field is empty.')
                console.log("Passenger post request failed:", data)
            }
        } catch(err) {
            console.error(err);
        }
    };

    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false); 
    }

    const handleCloseFailPopup = () => {
        setShowFailPopup(false); 
    }

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
                        placeholder="Start Location"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="End Location"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Number of people you have"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        min="1"
                        required
                    />
                    <input
                        type="datetime-local"
                        placeholder="Date and time you're looking for"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
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
            {showSuccessPopup && <SuccessPopup onClose={handleCloseSuccessPopup} msg={successMsg} />}
            {showFailPopup && <SuccessPopup onClose={handleCloseFailPopup} msg={failMsg} />}
        </div>
    );
};

export default PassengerPost;

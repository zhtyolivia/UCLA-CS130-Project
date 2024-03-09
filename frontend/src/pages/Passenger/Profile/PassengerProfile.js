import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import PassengerInfo from '../../../components/PassengerProfileInfo/PassengerProfileInfo';
import { getCurrentUserId, getUserRideHistory } from '../../../services/mockAPI';
import './PassengerProfile.scss';
import { isLoggedIn } from '../../../utils/LoginActions'; 

const PassengerProfile = () => {
    const [rideHistory, setRideHistory] = useState([]);

    useEffect(() => {
        const fetchRideHistory = async () => {
            const userId = await getCurrentUserId();
            const history = await getUserRideHistory(userId);
            setRideHistory(history);
        };
        
        fetchRideHistory();
        console.log(rideHistory)
    }, []);

    if (!isLoggedIn()) {
        return <Navigate to="/welcome" />;
    }

    return (
        <div>
            <header>
                <Navigation />
            </header>
            <div className="ProfilePage">
                <PassengerInfo />
                <div className="ride-history">
                    <h3>Ride History</h3>
                    {rideHistory.map((ride, index) => ( // Using index as a fallback key
                      <div key={ride.ride.id || index} className="ride-history-item">
                          <p><strong>Rideshare:</strong> {ride.ride.title}</p>
                          {/* Assuming 'lastUpdatedOn' is available on your ride object */}
                          <p><strong>Last updated on:</strong> {ride.ride.createdAt}</p> 
                          <p><strong>Status:</strong> {ride.status}</p>
                          {/* Make sure 'ride.ride.id' correctly references the post/ride ID */}
                          <Link to={`/posts/${ride.ride.id}`} className="view-detail-button">View Detail</Link>
                      </div>
                  ))}
                </div>

                <div className="ride-history">
                    <h3>Message History</h3>
                    {rideHistory.map((ride, index) => ( // Using index as a fallback key
                      <div key={ride.ride.id || index} className="ride-history-item">
                          {/* Assuming 'lastUpdatedOn' is available on your ride object */}
                          <p><strong>Last updated on:</strong> {ride.ride.createdAt}</p> 
                          <p><strong>Status:</strong> {ride.status}</p>
                          {/* Make sure 'ride.ride.id' correctly references the post/ride ID */}
                      </div>
                  ))}
                </div>

            </div>
        </div>
    );
};

export default PassengerProfile;
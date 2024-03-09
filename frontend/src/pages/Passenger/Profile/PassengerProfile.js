import React, { useState, useEffect } from 'react';
import { Link, Navigate, useResolvedPath } from 'react-router-dom';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import PassengerInfo from '../../../components/PassengerProfileInfo/PassengerProfileInfo';
import { getCurrentUserId, getUserRideHistory } from '../../../services/mockAPI';
import './PassengerProfile.scss';
import { isLoggedIn } from '../../../utils/LoginActions'; 
import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';


// const PassengerProfile = () => {
//     const [rideHistory, setRideHistory] = useState([]);

//     useEffect(() => {
//         const fetchRideHistory = async () => {
//             const userId = await getCurrentUserId();
//             const history = await getUserRideHistory(userId);
//             setRideHistory(history);
//         };
        
//         fetchRideHistory();
//         console.log(rideHistory)
//     }, []);

//     if (!isLoggedIn()) {
//         return <Navigate to="/welcome" />;
//     }

//     return (
//         <div>
//             <header>
//                 <Navigation />
//             </header>
//             <div className="ProfilePage">
//                 <PassengerInfo />
//                 <div className="ride-history">
//                     <h3>Ride History</h3>
//                     {rideHistory.map((ride, index) => ( // Using index as a fallback key
//                       <div key={ride.ride.id || index} className="ride-history-item">
//                           <p><strong>Rideshare:</strong> {ride.ride.title}</p>
//                           {/* Assuming 'lastUpdatedOn' is available on your ride object */}
//                           <p><strong>Last updated on:</strong> {ride.ride.createdAt}</p> 
//                           <p><strong>Status:</strong> {ride.status}</p>
//                           {/* Make sure 'ride.ride.id' correctly references the post/ride ID */}
//                           <Link to={`/posts/${ride.ride.id}`} className="view-detail-button">View Detail</Link>
//                       </div>
//                   ))}
//                 </div>

//                 <div className="ride-history">
//                     <h3>Message History</h3>
//                     {rideHistory.map((ride, index) => ( // Using index as a fallback key
//                       <div key={ride.ride.id || index} className="ride-history-item">
//                           {/* Assuming 'lastUpdatedOn' is available on your ride object */}
//                           <p><strong>Last updated on:</strong> {ride.ride.createdAt}</p> 
//                           <p><strong>Status:</strong> {ride.status}</p>
//                           {/* Make sure 'ride.ride.id' correctly references the post/ride ID */}
//                       </div>
//                   ))}
//                 </div>

//             </div>
//         </div>
//     );
// };

const PassengerProfile = () => {

    const [rideHistory, setRideHistory] = useState([]);
    const [email, setEmail] = useState(''); 
    const [name, setName] = useState(''); 
    const [phonenumber, setPhonenumber] = useState(''); 
    // Removed password from state since it should not be directly handled or displayed on the frontend for security reasons.

    useEffect(() => {
        const getPassengerProfile = async () => {
            try {
                console.log(window.localStorage.getItem("AuthToken"))
                const data = await axios.get(`${API_BASE_URL}/passenger/profile`).then((res) => res.data);
                console.log(data)
                setRideHistory(data.driverposts || []); 
                setEmail(data.email); 
                setPhonenumber(data.phonenumber); 
                setName(data.name); 

            } catch (err) {
                console.error(err);
            }
        };
        getPassengerProfile();
    });

    if (!isLoggedIn()) {
        return <Navigate to="/welcome" />;
    }

    return (
        <div>
            <header>
                <Navigation />
            </header>
            <div className="ProfilePage">
                <PassengerInfo fullName={name} email={email} phoneNumber={phonenumber}/>
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
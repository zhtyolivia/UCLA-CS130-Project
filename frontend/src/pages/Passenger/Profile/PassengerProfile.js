import React, { useState, useEffect } from 'react';
import { Link, Navigate, useResolvedPath } from 'react-router-dom';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import PassengerInfo from '../../../components/PassengerProfileInfo/PassengerProfileInfo';
import { getCurrentUserId, getUserRideHistory } from '../../../services/mockAPI';
import './PassengerProfile.scss';
import { isLoggedIn } from '../../../utils/LoginActions'; 
import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';


const PassengerProfile = () => {

    const [rideHistory, setRideHistory] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]); 
    const [email, setEmail] = useState(''); 
    const [name, setName] = useState(''); 
    const [phonenumber, setPhonenumber] = useState(''); 
    const [passengerPosts, setPassengerPosts] = useState([])

    useEffect(() => {
        const getPassengerProfile = async () => {
            try {
                const data = await axios.get(`${API_BASE_URL}/passenger/profile`).then((res) => res.data);
                setRideHistory(data.driverposts || []); 
                setEmail(data.email); 
                setPhonenumber(data.phonenumber); 
                setName(data.name); 
                setJoinRequests(data.rideshares);
                setPassengerPosts(data.passengerPosts);
                console.log(data)
            } catch (err) {
                console.error(err);
            }
        };
        getPassengerProfile();
    }, []);

    const convertDate2Readable = (dateString) => {
        const options = {
            timeZone: "America/Los_Angeles",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const date = new Date(dateString); // Convert string to Date object
        const datePacific = date.toLocaleString('en-US', options);
        return datePacific;
    }

    if (!isLoggedIn()) {
        return <Navigate to="/welcome" />;
    }
    return (
        <div>
            <header>
                <Navigation />
            </header>
            <div className="ProfilePage">
                <PassengerInfo name={name} email={email} phonenumber={phonenumber}/>
                <div className="ride-history">
                    <h3>Join Request History</h3>
                    <div className="section-divider"></div>
                    {joinRequests.map(joinRequest => ( // Using index as a fallback key
                      <div key={joinRequest.postId} className="ride-history-item">
                          <p><strong>Start location:</strong> {joinRequest.startingLocation}</p>
                          <p><strong>End location:</strong> {joinRequest.endingLocation}</p>
                          <p><strong>Start time:</strong> {convertDate2Readable(joinRequest.startTime)}</p>
                          <p><strong>Status:</strong> {joinRequest.status}</p>
                          <Link to={`/posts/${joinRequest.postId}`} className="view-detail-button">View Detail</Link>

                      </div>
                  ))}
                </div>
                
                <div className="ride-history">
                    <h3>Post History</h3>
                    <div className="section-divider"></div>
                    {passengerPosts.map(post => ( // Using index as a fallback key
                      <div key={post.postId} className="ride-history-item">
                          <p><strong>Start location:</strong> {post.startingLocation}</p>
                          <p><strong>End location:</strong> {post.endingLocation}</p>
                          <p><strong>Start time:</strong> {convertDate2Readable(post.startTime)}</p>
                      </div>
                  ))}
                </div>

            </div>
        </div>
    );
};


export default PassengerProfile;
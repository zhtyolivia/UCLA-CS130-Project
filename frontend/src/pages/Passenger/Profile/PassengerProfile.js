/* Part of this file was leveraged from GPT */ 
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useResolvedPath } from 'react-router-dom';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import PassengerInfo from '../../../components/PassengerProfileInfo/PassengerProfileInfo';
import { getCurrentUserId, getUserRideHistory } from '../../../services/mockAPI';
import './PassengerProfile.scss';
import { isLoggedIn } from '../../../utils/LoginActions'; 
import { convertDate2Readable } from '../../../utils/util'; 
import axios from "axios";
import { API_BASE_URL } from '../../../services/api';


const PassengerProfile = () => {

    const [rideHistory, setRideHistory] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]); 
    const [email, setEmail] = useState(''); 
    const [name, setName] = useState(''); 
    const [avatar, setAvatar] = useState('');
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
                setAvatar(data.avatar);
                console.log(data)
            } catch (err) {
                console.error(err);
            }
        };
        getPassengerProfile();
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
                <PassengerInfo name={name} email={email} phonenumber={phonenumber} avatar={avatar}/>
                <div className="ride-history">
                    <h3>Join Request History</h3>
                    <div className="section-divider"></div>
                    {joinRequests.map(joinRequest => ( // index: fallback key
                      <div key={joinRequest.postId} className="ride-history-item">
                          <p><strong>Start location:</strong> {joinRequest.startingLocation}</p>
                          <p><strong>End location:</strong> {joinRequest.endingLocation}</p>
                          <p><strong>Start time:</strong> {convertDate2Readable(joinRequest.startTime)}</p>
                          <p><strong>Status:</strong> {joinRequest.status}</p>
                          <Link to={`/driverposts/${joinRequest.postId}`} className="view-detail-button">View Detail</Link>

                      </div>
                  ))}
                </div>
                
                <div className="ride-history">
                    <h3>Post History</h3>
                    <div className="section-divider"></div>
                    {passengerPosts.map(post => ( 
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
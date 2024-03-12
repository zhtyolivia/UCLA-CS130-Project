import React, { useState, useEffect } from 'react';
import './DriverEditPopup.scss'; 
import defaultAvatar from '../../assets/default_avatar.jpeg';
import DriverEditPopup from './DriverEditPopup';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DriverInfo = ({name, email, phonenumber, avatar}) => {
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [profile, setProfile] = useState({
        name,
        email,
        phonenumber,
        avatar
      });
    const [showDriverPosts, setShowDriverPosts] = useState(false);
    const [showJoinRequests, setShowJoinRequests] = useState(false);
    const [driverPosts, setDriverPosts] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        setProfile({
            name: name,
            email: email,
            phonenumber: phonenumber,
            avatar: avatar
        });
    }, [name, email, phonenumber, avatar]); // Depend on props to update state
    
    const handleChange = (e) => {
        const { name, value, files } = e.target; 
        if (name === 'avatar') {
            setProfile(prev => ({ ...prev, avatar: files[0]}));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleEditClick = () => setShowEditPopup(true);

    const handleClosePopup = () => setShowEditPopup(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const profileData = {
            'name': profile.name, 
            'email': profile.email, 
            'phonenumber': profile.phonenumber
        }; 

        try{
            console.log('profileData:', profileData)
            const data = await axios.put(`${API_BASE_URL}/driver/update`, profileData).then((res) => res.data);
            if (data.status === 'SUCCESS') {
                setProfile(profile)
                setShowEditPopup(false); 
                window.location.reload();
            }
            console.log('Data:', data)
            if (data.status === 200) {
                if (profile.avatar && profile.avatar instanceof File) {
                    // If there's an avatar, perform a second request to upload avatar 
                    const formData = new FormData(); 
                    formData.append('avatar', profile.avatar); 
                    const avatarResponse = await axios.post(`${API_BASE_URL}/driver/avatar`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const avatarResult = avatarResponse.data; 
                    console.log('avatar result: ', avatarResult);
                }
                window.location.reload(); // Refresh the page to reflect changes
            }
        } catch(err) {
            console.error(err)
        }
    }

    const fetchMyDriverPosts = async () => {
        try {
            const token = window.localStorage.getItem('AuthToken');
            const response = await axios.get(`${API_BASE_URL}/driver/my-driver-posts`, {
                headers: { 'Authorization': token },
            });
            setDriverPosts(response.data);

        } catch (error) {
            console.error('Error fetching driver posts:', error.response ? error.response.data : error.message);
        }
    };
    
    const fetchJoinRequests = async () => {
        try {
            const token = window.localStorage.getItem('AuthToken');
            const response = await axios.get(`${API_BASE_URL}/driver/my-join-requests`, {
                headers: { 'Authorization': token },
            });
            setJoinRequests(response.data);

        } catch (error) {
            console.error('Error fetching join requests:', error.response ? error.response.data : error.message);
        }
    };

    // Toggle driver posts dropdown
    const toggleDriverPosts = () => {
        setShowJoinRequests(false); // Hide Join Requests when showing My Posts
        setShowDriverPosts(!showDriverPosts);
        if (!showDriverPosts && !driverPosts.length) {
            fetchMyDriverPosts();
        }
    };
    const handlePostClick = (post) => {
        navigate('/driver-post-detail', { state: { post } });
      };

    
    // Toggle join requests dropdown
    const toggleJoinRequests = () => {
        setShowDriverPosts(false); // Hide My Posts when showing Join Requests
        setShowJoinRequests(!showJoinRequests);
        if (!showJoinRequests && !joinRequests.length) {
            fetchJoinRequests();
        }
    };
    // Function to accept a join request
    const acceptJoinRequest = async (requestId) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/driverpost/join-requests/${requestId}/accept`);
            console.log('Accept Join Response:', response.data);
            // Optionally, refetch the join requests or update state here
            setJoinRequests(current =>
                current.map(request => 
                    request.requestId === requestId ? { ...request, status: 'accepted' } : request
                )
            );
        } catch (error) {
            console.error('Error accepting join request:', error.response ? error.response.data : error.message);
        }
    };

    // Function to decline a join request
    const declineJoinRequest = async (requestId) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/driverpost/join-requests/${requestId}/decline`);
            console.log('Decline Join Response:', response.data);
            // Optionally, refetch the join requests or update state here
            setJoinRequests(current =>
                current.map(request => 
                    request.requestId === requestId ? { ...request, status: 'declined' } : request
                )
            );
        } catch (error) {
            console.error('Error declining join request:', error.response ? error.response.data : error.message);
        }
    };
    return (
        <div className="driver-info-wrapper">
            <div className="driver-info">
                <div className="driver-info-header">
                    <div className="driver-avatar">
                        <img src={profile.avatar ? (profile.avatar instanceof File ? URL.createObjectURL(profile.avatar) : profile.avatar) : defaultAvatar} alt="Avatar" />
                    </div>
                    <div className="driver-details">
                        <h3>User Information</h3>
                        <p><strong>Username/Email:</strong> {email}</p>
                        <p><strong>Full Name:</strong> {name}</p>
                        <p><strong>Phone number:</strong> {phonenumber}</p>
                    </div>
                </div>
                <div className="button-container">
                    <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
                    <div className="post-request-buttons">
                        <button className="info-button" onClick={toggleDriverPosts}>My Posts</button>
                        <button className="info-button" onClick={toggleJoinRequests}>Join Requests</button>
                    </div>
                </div>


                {showDriverPosts && (
                    <div className="posts-container">
                        {driverPosts.map((post, index) => (
                            <div key={post._id} className="post-card" onClick={() => handlePostClick(post)}>
                                <div key={index} className="post-card">
                                    <h4>{post.title}</h4>
                                    <p><strong>Starting Location:</strong> {post.startingLocation}</p>
                                    <p><strong>Ending Location:</strong> {post.endingLocation}</p>
                                    <p><strong>Start Time:</strong> {new Date(post.startTime).toLocaleString()}</p>
                                    <p><strong>Seats Available:</strong> {post.numberOfSeats}</p>
                                    <p><strong>License Number:</strong> {post.licensenumber}</p>
                                    <p><strong>Car Model:</strong> {post.model}</p>
                                    <p><strong>Additional Notes:</strong> {post.additionalNotes}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showJoinRequests && (
                    <div className="requests-container">
                        {joinRequests.filter(request => request.status !== 'accepted' && request.status !== 'declined').map((request, index) => (
                            <div key={index} className="request-card">
                                <h4>Request from {request.passengerName}</h4>
                                <p><strong>Starting Location:</strong> {request.startingLocation}</p>
                                <p><strong>Ending Location:</strong> {request.endingLocation}</p>
                                <p><strong>Start Time:</strong> {new Date(request.startTime).toLocaleString()}</p>
                                <p><strong>Message:</strong> {request.message}</p>
                                <div className="request-actions">
                                    <button onClick={() => acceptJoinRequest(request.requestId)} className="accept-button">
                                        Accept
                                    </button>
                                    <button onClick={() => declineJoinRequest(request.requestId)} className="decline-button">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showEditPopup && 
                <DriverEditPopup 
                    onClose={handleClosePopup} 
                    onSubmit={handleSubmit} 
                    onChange={handleChange}
                    profile={profile}
                />
            }
        </div>
    );
}

export default DriverInfo;
import React, { useState, useEffect } from 'react';
import { getCurrentUserId, getUserProfile } from '../../services/mockAPI';
import './PassengerProfileInfo.scss'; 
import defaultAvatar from '../../assets/default_avatar.jpeg';
import EditInfoPopup from './EditInfoPopup';

const PassengerInfo = ({fullName, email, phoneNumber}) => {
    const [userProfile, setUserProfile] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false); 

    useEffect(() => {
        getCurrentUserId().then(userId => {
            getUserProfile(userId).then(profile => {
                setUserProfile(profile);
            });
        });
    }, []);

    const handleEditClick = () => setShowEditPopup(true);

    const handleClosePopup = () => setShowEditPopup(false);

    const handleSubmit = (e) => {
        e.preventDefault(); // Corrected typo
        // Implement functionality to actually update the user profile here
        console.log("Profile info updated");
        setShowEditPopup(false); 
    }

    if (!userProfile) return <div>Loading profile...</div>;

    return (
        <div className="passenger-info">
            <div className="passenger-avatar">
                {/* Display user's avatar or a default avatar */}
                <img src={defaultAvatar} alt={defaultAvatar} />
                {/* Show the edit info button */}
                <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
            </div>
            <div>
                <div className="passenger-info-header"> 
                    <h3>User Information</h3>
                </div>
                <div className="passenger-details">
                    <p><strong>Username/Email:</strong> {email}</p>
                    <p><strong>Full Name:</strong> {fullName}</p>
                    <p><strong>Phone number:</strong> {phoneNumber}</p>
                </div>
            </div>
            {showEditPopup && 
                <EditInfoPopup 
                    onClose={handleClosePopup} 
                    onSubmit={handleSubmit} 
                    userData={userProfile} // Pass current user data to the popup
                />
            }
        </div>
    );
}

export default PassengerInfo;


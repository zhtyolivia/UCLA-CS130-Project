import React, { useState, useEffect } from 'react';
import { getCurrentUserId, getUserProfile } from '../../services/mockAPI';
import './PassengerProfileInfo.scss'; 
import defaultAvatar from '../../assets/default_avatar.jpeg';
import EditInfoPopup from './EditInfoPopup';

import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const PassengerInfo = ({name, email, phonenumber}) => {
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [profile, setProfile] = useState({
        name,
        email,
        phonenumber
      });
    useEffect(() => {
        setProfile({
            name: name,
            email: email,
            phonenumber: phonenumber
        });
      }, [name, email, phonenumber]); // Depend on props to update state
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    }

    const handleEditClick = () => setShowEditPopup(true);

    const handleClosePopup = () => setShowEditPopup(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try{
            const data = await axios.put(`${API_BASE_URL}/passenger/update`, profile).then((res) => res.data);
            if (data.status === 'SUCCESS') {
                setProfile(profile)
                console.log(profile)
                console.log(data)
                setShowEditPopup(false); 
                // window.location.reload();
            }
        } catch(err) {
            console.error(err)
        }
    }

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
                    <p><strong>Full Name:</strong> {name}</p>
                    <p><strong>Phone number:</strong> {phonenumber}</p>
                </div>
            </div>
            {showEditPopup && 
                <EditInfoPopup 
                    onClose={handleClosePopup} 
                    onSubmit={handleSubmit} 
                    onChange={handleChange}
                    profile={profile}
                />
            }
        </div>
    );
}

export default PassengerInfo;
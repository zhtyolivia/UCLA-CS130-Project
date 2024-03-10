import React, { useState, useEffect } from 'react';
import './DriverInfo.scss';
import defaultAvatar from '../../assets/default_avatar.jpeg';
import DriverEditPopup from './DriverEditPopup'; // Make sure this component is correctly implemented
import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DriverInfo = ({name, email, phonenumber}) => {
    const [showEditPopup, setShowEditPopup] = React.useState(false);
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
            const data = await axios.put(`${API_BASE_URL}/driver/update`, profile).then((res) => res.data);
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
        <div className="driver-info-wrapper">
            <div className="driver-info">
                <div className="driver-avatar">
                    {/* Display user's avatar or a default avatar */}
                    <img src={defaultAvatar} alt={defaultAvatar} />
                    {/* Show the edit info button */}
                    <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
                </div>
                <div className="driver-info-content">
                    <div className="driver-info-header">
                        <h3>Driver Information</h3>
                    </div>
                    <div className="driver-details">
                        {/* Use profile properties. Make sure they exist before using them */}
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone Number:</strong> {phonenumber}</p>
                    </div>
                </div>
            </div>

            {showEditPopup && (
                <DriverEditPopup 
                    onClose={handleClosePopup}
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    userProfile={profile}
                />
            )}
        </div>
    );
};

export default DriverInfo;

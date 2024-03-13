// Displays information about the driver who initiated this rideshare.
// Used for the Post page. 
/* Part of this file was leveraged from GPT */ 

import React, { useState, useEffect } from 'react';
import './InitiatorInfo.css'; 
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../services/mockAPI'; 
import defaultAvatar from '../../assets/default_avatar.jpeg';

const InitiatorInfo = ({post}) => {
    console.log(post.avatar)
    return (
        <div className="user-info">
            <div className="user-avatar">
                {post.avatar === undefined && <img src={defaultAvatar} alt={defaultAvatar} />}
                {!post.avatar === undefined && <img src={post.avatar} alt={defaultAvatar} />}
            </div>
            <div>
                <div className="user-info-header"> 
                    <h3>Further Driver & Trip Information</h3>
                </div>
                <div className="user-details">
                    <p><strong>Full Name:</strong> {post.drivername}</p>
                    <p><strong>Email:</strong> {post.email}</p>
                    <p><strong>License Number:</strong> {post.licenseNumber}</p>
                    <p><strong>Phone number:</strong> {post.phonenumber}</p>
                    <p><strong>Email:</strong> {post.email}</p>
                </div>
            </div>
        </div>
    );
    
}

export default InitiatorInfo;

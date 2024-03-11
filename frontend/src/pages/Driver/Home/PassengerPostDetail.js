import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PassengerPostDetail.scss';


const PassengerPostDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            if (!id) return; // Add this line to prevent running with undefined id
            try {
                const response = await axios.get(`http://localhost:3001/passengerpost/${id}`);
                setPostDetails(response.data);
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };
    
        fetchPostDetails();
    }, [id]);

    if (!postDetails) return <div>Loading...</div>;

    // Render post details
    return (
        <div className="detail-container">
          <div className="detail-header">
            <h1>{postDetails.title}</h1>
          </div>
          <div className="detail-content">
            {/* Render other post details as needed */}
            <p>Starting Location: {postDetails.startingLocation}</p>
            <p>Ending Location: {postDetails.endingLocation}</p>
            {/* ...other fields */}
          </div>
        </div>
      );
};

export default PassengerPostDetail;

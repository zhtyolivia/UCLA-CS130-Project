import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../services/api'; 
import DriverNav from '../../../components/Navigation/DriverNavbar'; // Assuming this is your navbar component
import './PassengerPostDetail.scss';

const PassengerPostDetail = () => {
    const { postId } = useParams(); // This should match the parameter name in your route
    const [postDetails, setPostDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation


    useEffect(() => {
      const fetchPostDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/passengerpost/${postId}`);
          console.log("Post details fetched successfully:", response.data);
          setPostDetails(response.data);
        } catch (error) {
          console.error('Error fetching post details:', error);
          setError('Failed to load post details.');
        } finally {
          setLoading(false);
        }
      };
    
      if (postId) {
        fetchPostDetails();
      } else {
        setError('No post ID provided.');
        setLoading(false);
      }
    }, [postId]);
    
    const goBack = () => {
      navigate('/driver-home'); // Updated to navigate to '/driver-home'
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!postDetails) return <Navigate to="/" />; // Redirect if no postDetails

    return (
      <div className="passenger-post-detail">
        <DriverNav />
        <button className="back-button" onClick={goBack}>Back</button>
        <div className="detail-container">
          <div className="detail-header">
            <h1>{postDetails.title}</h1>
          </div>
          <div className="detail-label">Starting Location:</div>
          <div className="detail-value">{postDetails.startingLocation}</div>
          <div className="detail-label">Ending Location:</div>
          <div className="detail-value">{postDetails.endingLocation}</div>
          <div className="detail-label">Date & Time:</div>
          <div className="detail-value">{new Date(postDetails.startTime).toLocaleString()}</div>
          <div className="detail-label">Number of passenger:</div>
          <div className="detail-value">{postDetails.numberOfPeople}</div>
          <div className="detail-label">Description:</div>
          <div className="detail-value">{postDetails.additionalNotes}</div>
          {/* Add more details as needed */}
        </div>
      </div>
    );
  };
  

export default PassengerPostDetail;

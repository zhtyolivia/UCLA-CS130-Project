/* Part of this file was leveraged from GPT */ 
import React from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import DriverNav from '../../../components/Navigation/DriverNavbar'; 
import './DriverPostDetail.scss';

const DriverPostDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { post } = state || {};

const handleBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };
  if (!post) {
    return <div>No post data available. Please select a post from the driver dashboard.</div>;
  }

  return (
    <div>
      <DriverNav /> {/* This is the navigation bar */}
      <div className="driver-post-detail">
        <button onClick={handleBack} className="back-button">Back</button>
        <div className="post-details">
          <h1>Ride Details</h1>
          <p><strong>Starting Location:</strong> {post.startingLocation}</p>
          <p><strong>Ending Location:</strong> {post.endingLocation}</p>
          <p><strong>Start Time:</strong> {new Date(post.startTime).toLocaleString()}</p>
          <p><strong>Seats Available:</strong> {post.numberOfSeats}</p>
          <p><strong>License Number:</strong> {post.licensenumber}</p>
          <p><strong>Car Model:</strong> {post.model}</p>
          <p><strong>Additional Notes:</strong> {post.additionalNotes}</p>
        </div>
        {post.passengers && (
          <div className="passenger-cards-container">
            <h2>Passengers</h2>
            {post.passengers.map((passenger, index) => (
              <div key={passenger._id} className="passenger-card">
                <p><strong>Name:</strong> {passenger.name}</p>
                <p><strong>Email:</strong> {passenger.email}</p>
                <p><strong>Phone Number:</strong> {passenger.phonenumber}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default DriverPostDetail;

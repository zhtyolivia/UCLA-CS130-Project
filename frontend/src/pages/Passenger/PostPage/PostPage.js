// PostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { API_BASE_URL, } from '../../../services/api'; 
// Components 
import Navigation from '../../../components/Navigation/PassengerNavbar'; 
import InitiatorInfo from '../../../components/InitiatorInfo/InitiatorInfo'; 
import JoinReqPopup from '../../../components/JoinReqPopup/JoinReqPopup'; 
import { isLoggedIn } from '../../../utils/LoginActions'; 

// Styles 
import './PostPage.scss'; 

import axios from 'axios';

function PostPage() {
  const [post, setPost] = useState(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const { id } = useParams();

//   useEffect(() => {
//     const getPassengerProfile = async () => {
//         try {
//             const data = await axios.get(`${API_BASE_URL}/passenger/profile`).then((res) => res.data);
//             setRideHistory(data.driverposts || []); 
//             setEmail(data.email); 
//             setPhonenumber(data.phonenumber); 
//             setName(data.name); 
//             setJoinRequests(data.rideshares);
//             setPassengerPosts(data.passengerPosts);
//             console.log(data)
//         } catch (err) {
//             console.error(err);
//         }
//     };
//     getPassengerProfile();
// }, []);

  useEffect( () => {
    const getPost = async () => {
      try {
        console.log(id); 
        const response = await axios.get(`${API_BASE_URL}/driverpost/${id}`);
        console.log(response.data);
        setPost(response.data.driverPost);
        console.log('driverPost:', response.data.driverPost)
      } catch(err) {
        console.error(err); 
      }
    }; 
    getPost();
    
  }, []); 

  const handleRequestClick = () => {
    setShowRequestPopup(true);
  };

  const handleClosePopup = () => {
    setShowRequestPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement what should happen when the form is submitted
    setShowRequestPopup(false);
    // For example, send a request to join
    console.log("Join request sent.");
  };

  if (!post) {
    console.log(id)
    return <div>Loading post...</div>;
  }

  // If the user hasn't logged in, navigate to welcome page.
  if (!isLoggedIn()) {
    return <Navigate to="/welcome" />;
  }

  return (
    <div>
      <header>
        <Navigation />
      </header>
      <div className="PostPage">
        
        <div className="post-details">
        <h2>Trip Information</h2>
          {/* <h2>{post.title}</h2> */}
          
          <p><strong>Start Location:</strong> {post.startingLocation}</p>
          <p><strong>End Location:</strong> {post.endingLocation}</p>
          <p><strong>Date & Time:</strong> {post.startTime}</p>
          <p><strong>Remaining Seats:</strong> {post.remainingSeats}</p>

          <div className='join-container'>
            <button className="join-button" onClick={handleRequestClick}>Send join request</button>
          </div>

          <div className="post-content">
            <p>{post.content}</p>
          </div>
        </div>

        <InitiatorInfo post={post}/>

      </div>
      {showRequestPopup && <JoinReqPopup onClose={handleClosePopup} onSubmit={handleSubmit} />}
    </div>
  );
}

export default PostPage;

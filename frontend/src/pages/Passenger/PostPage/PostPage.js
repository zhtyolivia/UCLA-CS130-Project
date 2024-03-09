// PostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchPostById } from '../../../services/api'; 
// Components 
import Navigation from '../../../components/Navigation/PassengerNavbar'; 
import InitiatorInfo from '../../../components/InitiatorInfo/InitiatorInfo'; 
import JoinReqPopup from '../../../components/JoinReqPopup/JoinReqPopup'; 
import { isLoggedIn } from '../../../utils/LoginActions'; 

// Styles 
import './PostPage.scss'; 

// Mock API 

function PostPage() {
  const [post, setPost] = useState(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchPostById(id).then(data => {
      setPost(data);
    }).catch(error => {
      console.error("Error fetching post:", error);
    });
  }, [id]);

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
        <InitiatorInfo />
        <div className="post-details">
          <h2>{post.title}</h2>
          <div className='join-container'>
            <button className="join-button" onClick={handleRequestClick}>Send join request</button>
          </div>
          <p><strong>Start Location:</strong> {post.startingLocation}</p>
          <p><strong>End Location:</strong> {post.endingLocation}</p>
          <p><strong>Remaining Seats:</strong> {post.remainingSeats}</p>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
        </div>
      </div>
      {showRequestPopup && <JoinReqPopup onClose={handleClosePopup} onSubmit={handleSubmit} />}
    </div>
  );
}

export default PostPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DriverHome.scss'; 
import DriverNav from '../../../components/Navigation/DriverNavbar'; 
import PostCard from '../../../components/RideshareCard/PassengerRideShareCard';

const DriverHome = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchPassengerPosts = async () => {
          try {
              const response = await axios.get('http://localhost:3001/driver/passengerposts');
              const formattedPosts = response.data.map(post => ({
                  ...post,
                  startTime: new Date(post.startTime).toLocaleString('default', { 
                      year: 'numeric', month: 'long', day: 'numeric', 
                      hour: '2-digit', minute: '2-digit'
                  })
              }));
              setPosts(formattedPosts);
              console.log("Fetched and formatted posts:", formattedPosts);
          } catch (error) {
              console.error('Error fetching passenger posts:', error);
          }
      };

      fetchPassengerPosts();
  }, []);

  const handlePostClick = (postId) => {
      navigate(`/passenger-post/${postId}`);
      console.log("Navigating to post ID:", postId);
  };

  return (
      <div className="Home">
          <DriverNav />
          <main className="posts-grid">
              {posts.map((post) => (
                  <div key={post._id} onClick={() => handlePostClick(post._id)} className="post-card">
                      <PostCard
                          title={post.title}
                          startingLocation={post.startingLocation}
                          endingLocation={post.endingLocation}
                          availableSeats={post.numberOfPeople}
                          startTime={post.startTime}
                          additionalNotes={post.additionalNotes}
                      />
                  </div>
              ))}
          </main>
      </div>
  );
}

export default DriverHome;


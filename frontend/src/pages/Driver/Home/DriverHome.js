import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DriverHome.scss'; 
import DriverNav from '../../../components/Navigation/DriverNavbar'; 
import PostCard from '../../../components/RideshareCard/RideshareCard';

const DriverHome = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchPassengerPosts = async () => {
          try {
              const response = await axios.get('http://localhost:3001/driver/passengerposts');
              // Map over the data and convert the start time to a readable format
              const formattedPosts = response.data.map(post => ({
                  ...post,
                  startTime: new Date(post.startTime).toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              }));
              setPosts(formattedPosts);
              console.log("Fetched and formatted posts:", formattedPosts); // Logging the formatted posts
          } catch (error) {
              console.error('Error fetching passenger posts:', error);
          }
      };
  
      fetchPassengerPosts();
  }, []);
  

    const handlePostClick = (postId) => {
        // Navigate to the post detail page when a post is clicked
        // You will need to create this route and component
        navigate(`/post/${postId}`);
    };

    return (
        <div className="Home">
            <DriverNav />
            <main className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} onClick={() => handlePostClick(post.id)} className="post-card">
                  <PostCard
                    // Assuming 'title' and 'additionalNotes' are part of your post object
                    title={post.title}
                    startingLocation={post.startingLocation}
                    endingLocation={post.endingLocation}
                    availableSeats={post.numberOfPeople} // Make sure this matches your data field
                    startTime={post.startTime} // Assuming this is already formatted as a string
                    additionalNotes={post.additionalNotes} // Include this if you have this field
                  />
                </div>
              ))}
            </main>
        </div>
    );
}

export default DriverHome;

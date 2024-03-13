/* Part of this file was leveraged from GPT */ 
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'; 
import './PassengerHome.scss';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import Post from '../../../components/RideshareCard/RideshareCard';
import { fetchDriverPosts } from '../../../services/api'; 
import { isLoggedIn } from '../../../utils/LoginActions'; 

function PassengerHome() {

  const [posts, setPosts] = useState([]); 


  useEffect(() => {
    fetchDriverPosts().then(data => {
      setPosts(data);
    }).catch(error => {
      console.error("Error fetching driver posts:", error);
    });
  }, []);

  if (!isLoggedIn()) {
    return <Navigate to="/welcome" />;
  }
  
  return (
    <div className="Home">
      <header>
        <Navigation />

      </header>
      <main className="posts-grid">
        {posts.map(post => (
          <Post 
            key={post._id}
            id={post._id}
            startingLocation={post.startingLocation} 
            endingLocation={post.endingLocation} 
            availableSeats={post.numberOfSeats}
            startTime={post.startTime}
            content={post.additionalNotes} 
          />
        ))}
      </main>


    </div>
  );
}

export default PassengerHome;

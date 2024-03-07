// App.js
import React, { useState, useEffect } from 'react';
import './PassengerHome.scss';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import Post from '../../../components/RideshareCard/RideshareCard';
import { fetchPosts } from '../../../services/mockAPI';

function PassengerHome() {

  const [posts, setPosts] = useState([]); // Initialize posts state to an empty array

  useEffect(() => {
    fetchPosts().then(data => {
      setPosts(data); // Update the posts state with fetched data
    });
  }, []); 

  return (
    <div className="Home">
      <header>
        <Navigation />
      </header>
      <main className="posts-grid">
        {posts.map(post => (
          <Post id={post.id} title={post.title} startingLocation={post.startingLocation} endingLocation={post.endingLocation} availableSeats={post.remainingSeats} content={post.content} />
        ))}
      </main>
    </div>
  );
}

export default PassengerHome;

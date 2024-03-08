
import React, { useState, useEffect } from 'react';
import './PassengerHome.scss';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import Post from '../../../components/RideshareCard/RideshareCard';
import { fetchDriverPosts } from '../../../services/api'; // Make sure the path is correct

function PassengerHome() {

  const [posts, setPosts] = useState([]); // Initialize posts state to an empty array


  useEffect(() => {
    fetchDriverPosts().then(data => {
      console.log('Fetched posts:', data);
      setPosts(data);
      console.log('State updated');
    }).catch(error => {
      console.error("Error fetching driver posts:", error);
    });
  }, []);


  return (
    <div className="Home">
      <header>
        <Navigation />

      </header>
      <main className="posts-grid">
        {posts.map(post => (
          <Post id={post.id} title={post.title} startingLocation={post.startingLocation} endingLocation={post.endingLocation} content={post.additionalNotes} />
        ))}
      </main>
    </div>
  );
}

export default PassengerHome;

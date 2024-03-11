import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import Post from '../../../components/RideshareCard/RideshareCard';
import { fetchSearchResults } from '../../../services/api.js';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import { isLoggedIn } from '../../../utils/LoginActions'; 


function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchSearchResults(searchQuery).then(data => {
      console.log('Feteched search results:', data); 
      setPosts(data); 
      console.log('State updated'); 
    }).catch(error => {
      console.error('Error fetching search results:', error)
    })
    console.log(searchQuery)
  }, [searchQuery]);

  if (!isLoggedIn()) {
    return <Navigate to="/welcome" />;
  }

  if (posts.length == 0) {
    return (
      <div className="Home">
        <header>
          <Navigation searchQuery={searchQuery} />
        </header>
        <div style={{ marginTop: '30px' }}> 
          <h3>No results found</h3>
      </div>
        
      </div>
    )
  }

  if (searchQuery === "") {
    return <Navigate to="/home" />;
  }
  return (
    <div className="Home">
      <header>
        <Navigation searchQuery={searchQuery} />
      </header>
      <main className="posts-grid">
        {posts.map(post => ( // Iterate over posts array
          <Post key={post.id} {...post} />
        ))}
      </main>
    </div>
  );
}

export default SearchResults;

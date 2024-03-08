import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Post from '../../../components/RideshareCard/RideshareCard';
import { getSearchResult } from '../../../services/mockAPI';
import Navigation from '../../../components/Navigation/PassengerNavbar';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getSearchResult(searchQuery).then(setPosts);
  }, [searchQuery]);

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

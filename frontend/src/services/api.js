// services/api.js
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const fetchPostById = async (id) => {
  try {
    console.log(id)
    const response = await fetch(`${API_BASE_URL}/driverpost/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error fetching data: ", e);
    throw e; 
  }
};

export const fetchDriverPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/driverpost`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      return posts;
    } catch (e) {
      console.error("Error fetching driver posts: ", e);
      throw e;
    }
  };

  
  
export const fetchSearchResults = async (term) => {
  try {
    const response = await fetch(`${API_BASE_URL}/driverpost/search?term=${term}`); 
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results = await response.json(); 
    return results; 
  } catch (e) {
    console.error("Error fetching search resultsL ", e); 
    throw e; 
  }
}




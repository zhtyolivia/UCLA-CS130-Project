// services/api.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const fetchPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/driverpost/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error fetching data: ", e);
    throw e; // Re-throw the error for handling it in the calling function
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
  
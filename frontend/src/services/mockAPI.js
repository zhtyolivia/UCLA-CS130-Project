// Sample structure for passenger 
// const passenger = {
//     id: 1, 
//     username: 'test_passenger',
//     name: 'Olive',
//     email: 'olive@example.com',
//     avatarUrl: 'https://example.com/avatar.png'
// 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Sample structure for drivers
const users = [
    { 
        id: 1, 
        username: 'olivia_zhang', 
        name: 'Olivia Zhang', 
        email: 'olivia@example.com',
        avatarUrl: 'https://example.com/avatar.png'
    },
    { 
        id: 2, 
        username: 'john_doe', 
        name: 'John Doe', 
        email: 'john@example.com',
        avatarUrl: 'https://example.com/avatar.png'
    }
];

// Sample structure for posts
const posts = [
    {
        id: 1, 
        userId: 1, 
        title: 'LA to SD', 
        startingLocation: 'LA', 
        endingLocation: 'SD', 
        remainingSeats: 5, 
        content: 'I will be driving from Westwood to San Diego on Sun Feb 18. Looking for another five ppl to carpool. ', 
        createdAt: '2024-02-14', 
        lastUpdatedOn: 'Mar 24 2024'
    },
    {
        id: 2, 
        userId: 1, 
        title: 'SD to LA', 
        startingLocation: 'SD', 
        endingLocation: 'LA', 
        remainingSeats: 4, 
        content: 'I will be driving from San Diego to Westwood on Sun Feb 28. Looking for another four ppl to carpool. ', 
        createdAt: '2024-02-14', 
        lastUpdatedOn: 'Mar 24 2024'
    },
    {
        id: 3, 
        userId: 1, 
        title: 'Westwood to Malibu', 
        startingLocation: 'Westwood', 
        endingLocation: 'Malibu', 
        remainingSeats: 3, 
        content: 'Finding ppl to drive to Malibu together from Westwood!', 
        createdAt: '2024-02-15' 
    },
];

  
// Simulate fetching all users
export const fetchUsers = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(users), 10); // Simulate network delay
    });
  };
  
// Simulate fetching all posts
export const fetchPosts = () => {
return new Promise((resolve) => {
    setTimeout(() => {
    resolve(posts); // Resolve the promise with the sample posts
    }, 5); // Simulate a network delay
});
};

/*
export const fetchPostById = (id) => {
    return new Promise((resolve, reject) => { // Ensure both resolve and reject are defined here
      setTimeout(() => {
        const post = posts.find(post => post.id === id);
        if (post) {
          const user = users.find(user => user.id === post.userId);
          if (user) {
            resolve({...post, user}); // Attach the user object to the post and resolve it
          } else {
            reject(new Error('User not found')); // Use reject when the user isn't found
          }
        } else {
          reject(new Error('Post not found')); // Use reject when the post isn't found
        }
      }, 5);
    });
  };
*/
  
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

// Simulate fetching a single user by ID
export const fetchUserById = (id) => {
    return new Promise((resolve) => {
        const user = users.find(user => user.id === id);
        setTimeout(() => resolve(user), 10);
});
};

// Simulate fetching posts for a specific user
export const fetchPostsByUserId = (userId) => {
    return new Promise((resolve) => {
        const userPosts = posts.filter(post => post.userId === userId);
        setTimeout(() => resolve(userPosts), 10);
    });
};

export const getCurrentUserId = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1); // Simulating fetching current user's ID; replace 1 with dynamic logic as needed
      }, 100);
    });
  };

  
// Mock function to simulate fetching user profile information based on ID
export const getUserProfile = (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Using the passenger object as the resolved value
        const passenger = {
            id: userId, // Assuming the ID passed in should match the passenger ID
            username: 'test_passenger',
            name: 'Olive',
            email: 'olive@example.com',
            avatarUrl: 'https://example.com/avatar.png'
        };
        resolve(passenger);
      }, 100);
    });
};

export const getUserRideHistory = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Example: Returning the first post for demonstration; adjust as needed
      const firstPostId = posts[0].id; // Assuming 'posts' array is accessible in this scope
      const rideHistory = [{
        ride: posts.find(post => post.userId === userId && post.id === firstPostId),
        status: 'joined' // Example status; adjust based on your logic
      }]; 
      resolve(rideHistory); 
    }, 100)
  })
}

export const getJoinRequestNotifications = (userId) => {
  /*
    Returns 
  */
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifications = [
        {
          id: 1, // notification id 
          userId: 1, 
          ride: posts[0],
          status: "accepted", // "accepted" or "rejected"
        },
        {
          id: 2,
          userId: 1, 
          ride: posts[1],
          status: "rejected",
        },
      ];
      resolve(notifications.filter(notification => notification.userId === userId));
    }, 100);
  });
};
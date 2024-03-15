## Motivation/Concept

In California, especially in Los Angeles, there exists a pressing need for ridesharing as an efficient, cost-effective, and environmentally friendly transportation option. There are several existing solutions to the problem. Ride-hailing companies – most notably Uber Technologies, Inc. and Lyft, Inc. – provide shared rides by connecting riders who share similar routes and offering them a discounted price. However, these services are not flexible enough, and traveling for a long distance is still expensive and in some cases impossible. Our proposed application, **Swift Link**, aims to address these challenges. This website will enable users to connect with others for shared rides. The core premise is simple yet powerful: facilitate ride sharing for people traveling to or from Los Angeles from other parts of California, especially benefiting those who do not own a car, who need more riders to use the carpool lanes, and/or who seek people to split fuel expenses.

  

There are two types of accounts--driver account and passenger account. A driver can initiate a rideshare, and passengers can request to join a rideshare.

  

After initiating a rideshare, a driver will be notifed when a passenger requests to join. Then the driver will be able to accept/decline the request. Upen accepting, the driver will have access to the passenger's contact information.

  

After identifying a rideshare to join, a passenger can send a join request and cancel the request. After the request is accepted, the passenger can view further information about the ride and the driver, therefore making the rideshare possible.

  

We believe Swift Link is able to bridge the gap in the current ride-sharing landscape by offering a user-friendly solution. It caters specifically to the needs of Californians, especially those in and around Los Angeles, who are looking for ridesharing. Our team has been focusing on implementing this idea by building an MVP of the product, thereby offering a solution to the ridesharing need in California.

  

## Our Website

  

Our website can be found [here](https://main--rideshare-swiftlink.netlify.app/)!

  

## Installation

If you'd like to host the app locally. Please follow the instruction in this section. 

To use Google Auth API locally, in `/backend/.env`, change the line 

```
GOOGLE_REDIRECT_URI='https://main--rideshare-swiftlink.netlify.app'
```

to 

```
GOOGLE_REDIRECT_URI='http://localhost:3000'
```

Then start the backend. Navigate to `/backend` and run 

```
npm install 
npm start
```

To test the backend locally, run

```
npm test
```

To start the frontend, navigate to `/frontend` and run 
```
npm install 
npm start
```

To test the frontend locally, run

```
npm test
```

With steps above, you will open the SwiftLink welcome page on port 3000 in your browser. 

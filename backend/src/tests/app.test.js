//part of this file was leveraged from GPT/Copilot
const request = require('supertest');
const app = require('../../server'); 
const Driverpost = require('../models/driverpost_model'); 

jest.mock('../models/driverpost_model', () => {
  return {
    find: jest.fn(),
  };
});

describe('GET /driverpost', () => {
  it('should return all driver posts', async () => {
      const mockDate = new Date().toISOString();
      const mockPosts = [
        {
          _id: '5f50c31f1c7d4a3d2f22dd5a',
          driverId: '5f50c31f1c7d4a3d2f22dd45',
          startingLocation: 'Start Location',
          endingLocation: 'End Location',
          startTime: mockDate,
          licensenumber: '123456',
          model: 'Some Car Model',
          numberOfSeats: 4,
          phonenumber: '1234567890',
          email: 'testdriver@test.com',
          additionalNotes: 'Some additional notes',
          passengers: [],
          joinrequests: []
        }
      ];
      Driverpost.find.mockResolvedValue(mockPosts);

    const response = await request(app).get('/driverpost/'); 
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockPosts);
    expect(Driverpost.find).toHaveBeenCalledWith({});
  });

  it('should handle errors', async () => {

    const errorMessage = { message: "Internal server error" };
    Driverpost.find.mockRejectedValue(new Error('Internal server error'));


    const response = await request(app).get('/driverpost/'); 
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(errorMessage);
  });
});
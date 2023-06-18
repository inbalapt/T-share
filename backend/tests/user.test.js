import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { register } from '../controllers/auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Register User Test
describe("Register User", () => {
  it("should register a new user successfully", async () => {
    // Create a test user object with the required fields
    const user = {
      username: "",
      fullName: "Test User",
      email: "testuser@example.com",
      password: "password",
      picturePath: "path/to/picture",
      city: "New York",
      size: "32",
    };

    // Mock the necessary functions and dependencies
    User.findOne = jest.fn().mockReturnValue(null);
    User.prototype.save = jest.fn().mockResolvedValue(user);
    const bcryptMock = { genSalt: jest.fn(), hash: jest.fn().mockResolvedValue('hashed-password') };
    const jwtMock = { sign: jest.fn().mockReturnValue('mocked-token') };
    const req = { body: user };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the register controller function directly
    await register(req, res);

    // Check the response status code and body
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
    // Add additional assertions as needed
  });

  // Add more tests for error cases, e.g., existing user, invalid data, etc.
});


const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
import { expect } from 'chai';
import chai from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import fs from 'fs';
import User from '../models/User.js';
import Item from '../models/Item.js';
import {register,login} from '../controllers/auth.js';
import { getUserDetails, updateUserDetails, getCredit } from '../controllers/user.js';


describe('User Account Management', () => {
    describe('register', () => {
        afterEach(() => {
            sinon.restore(); // Restore original behavior after each test
          });
      it('should create a new user and return the saved user', async () => {
        const req = {
          body: {
            username: 'testuser',
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'testpassword',
            picturePath: '/path/to/picture',
            friends: [],
            myUploads: [],
            myBoughts: [],
            favItems: [],
            city: 'Test City',
            size: '32',
            credit: 50,
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub(),
        };
  
        sinon.stub(User.prototype, 'save').resolves(req.body);
  
        await register(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(req.body)).to.be.true;
  
        User.prototype.save.restore();
      });
  
      it('it should reject registering without username', async () => {
        const req = {
          body: {
            username: '',
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'testpassword',
            picturePath: '/path/to/picture',
            friends: [],
            myUploads: [],
            myBoughts: [],
            favItems: [],
            city: 'Test City',
            size: '32',
            credit: 50,
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub(),
        };
  
        sinon.stub(User.prototype, 'save').resolves(req.body);
  
        await register(req, res);
  
        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith(req.body)).to.be.true;
  
        User.prototype.save.restore();
      });
  
    });


    describe('login', () => {
        afterEach(() => {
            sinon.restore(); // Restore original behavior after each test
          });
        it('should authenticate the user and return a token and user data', async () => {
          const req = {
            body: {
              username: 'testuser',
              password: 'testpassword',
            },
          };
          const user = {
            _id: '123456789',
            username: 'testuser',
            password: 'hashedpassword',
          };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
          };
    
          sinon.stub(User, 'findOne').resolves(user);
          sinon.stub(bcrypt, 'compare').resolves(true);
          sinon.stub(jwt, 'sign').returns('testtoken');
    
          await login(req, res);
    
          expect(User.findOne.calledWith({ username: 'testuser' })).to.be.true;
          expect(bcrypt.compare.calledWith('testpassword', 'hashedpassword')).to.be.true;
          expect(jwt.sign.calledWith({ id: '123456789' }, process.env.JWT_SECRET)).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.json.calledWith({ token: 'testtoken', user: { _id: '123456789', username: 'testuser' } })).to.be.true;
    
          User.findOne.restore();
          bcrypt.compare.restore();
          jwt.sign.restore();
        });

        it('should return an error if the password is invalid', async () => {
            const req = {
              body: {
                username: 'testuser',
                password: 'wrongpassword',
              },
            };
            const user = {
              _id: '123456789',
              username: 'testuser',
              password: 'hashedpassword',
              // other user data
            };
            const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
            };
      
            sinon.stub(User, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(false);
      
            await login(req, res);
      
            expect(User.findOne.calledWith({ username: 'testuser' })).to.be.true;
            expect(bcrypt.compare.calledWith('wrongpassword', 'hashedpassword')).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: 'Invalid credentials. ' })).to.be.true;
      
            User.findOne.restore();
            bcrypt.compare.restore();
          });
    });

    describe('getUserDetails', () => {
        afterEach(() => {
            sinon.restore(); // Restore original behavior after each test
          });
        it('should return the user details', async () => {
          const req = {
            query: {
              username: 'testuser',
            },
          };
          const user = {
            city: 'Test City',
            size: '32',
            credit: 50,
            email: 'test@example.com',
            picturePath: '/path/to/picture',
          };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
          };
    
          sinon.stub(User, 'findOne').resolves(user);
    
          await getUserDetails(req, res);
    
          expect(User.findOne.calledWith({ username: 'testuser' })).to.be.true;
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.json.calledWith({
            city: 'Test City',
            size: '32',
            credit: 50,
            email: 'test@example.com',
            image: '/path/to/picture',
          })).to.be.true;
    
          User.findOne.restore();
        });
    
        it('should return an error if an internal server error occurs', async () => {
          const req = {
            query: {
              username: 'testuser',
            },
          };
          const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
          };
    
          sinon.stub(User, 'findOne').throws(new Error('Internal server error'));
    
          await getUserDetails(req, res);
    
          expect(User.findOne.calledWith({ username: 'testuser' })).to.be.true;
          expect(res.status.calledWith(500)).to.be.true;
          expect(res.send.calledWith('Internal server error')).to.be.true;
    
          User.findOne.restore();
        });
    
      });
      describe('updateUserDetails', () => {
      
        afterEach(() => {
          sinon.restore();
        });
      
        it('should update user details without a file', async () => {
            const req = {
              body: {
                username: 'testChange',
                size: '32',
              },
            };
            const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
            };
            const user = {
              username: 'testChange',
              size: '32',
              save: sinon.stub().returnsThis(),
            };
          
            //sinon.stub(user, 'save').resolves();
            sinon.stub(User, 'findOne').resolves(user);
          
            await updateUserDetails(req, res);
          
            console.log(res.status.calledWith(200)); // Add this line
            console.log(res.status.args); // Add this line
          
            expect(res.status.calledWith(200)).to.be.true;
          });
          
        it('should return a 404 error if the user is not found', async () => {
          // Mock the request and response objects
          const req = {
            body: {
              username: 'nonExistingUsername',
              city: 'New York',
            },
          };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
          };
    
          // Mock the User.findOne method to return null
          sinon.stub(User, 'findOne').resolves(null);
    
          // Call the updateUserDetails function
          await updateUserDetails(req, res);
    
          // Check the response
          expect(res.status.calledWith(404)).to.be.true;
          expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
        });
    });
    describe('getCredit', () => {
        afterEach(() => {
            sinon.restore(); // Restore original behavior after each test
          });
        it('should return the user credit', async () => {
          // Mock the request and response objects
          const req = {
            query: {
              username: 'testuser',
            },
          };
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
          };
    
          // Mock the User.findOne method
          const mockUser = {
            username: 'testuser',
            credit: 100,
          };
          sinon.stub(User, 'findOne').resolves(mockUser);
    
          // Call the function
          await getCredit(req, res);
    
          // Check the response
          expect(res.status.calledWith(200)).to.be.true;
          expect(res.json.calledWith({ credit: 100})).to.be.true;
        });
    
        it('should handle an internal server error', async () => {
          // Mock the request and response objects
          const req = {
            query: {
              username: 'testuser',
            },
          };
        
          const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
          };
    
          sinon.stub(User, 'findOne').resolves(null);
          
         
          // Call the function
          await getCredit(req, res);
    
         
          // Check the response
          expect(res.status.calledWith(500)).to.be.true;
          expect(res.json.calledWith({error: 'Internal server error'})).to.be.true;
          
        });
      });
});

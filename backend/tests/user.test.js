// userController.test.js
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

import User from '../models/User.js';
import {register,login} from '../controllers/auth.js';
import { getUserDetails } from '../controllers/user.js';

describe('User Account Management', () => {
    describe('register', () => {
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
});
  
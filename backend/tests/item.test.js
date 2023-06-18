
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Item from '../models/Item.js';
import { uploadItem , addFavoriteItem , getItemById, autocomplete ,buyItem, getUserItems} from '../controllers/item.js';  // Replace with actual import
//import {register,login} from '../controllers/auth.js';
import { getUserDetails } from '../controllers/user.js';
const { Types } = mongoose;




//User Story 5: Add to Favorites
describe('addFavoriteItem', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should add the item to user favorites and return the updated favorites array', async () => {
        const mockItem = {
          _id: new Types.ObjectId(),
          pictures: ["image1.jpg", "image2.jpg"],
          sellerUsername: 'testuser',
          sellerFullName: 'Test User',
          description: 'An item description',
          userDescription: 'An user description',
          price: 100,
          size: '38',
          itemLocation: 'Location',
          category: 'dresses',
          condition: 'new',
          color: 'red',
          brand: 'test-brand',
          isBought: false,
          time: Date.now(),
          likes: [],
          labels: [],
          save: sinon.stub().resolves()
        };
  
        const mockUser = {
          _id: new Types.ObjectId(),
          username: 'testuser',
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'password',
          picturePath: 'user.jpg',
          friends: [],
          myUploads: [],
          myBoughts: [],
          favItems: [],
          following: [],
          followers: [],
          city: 'Test city',
          size: '38',
          credit: 30,
          hasUnreadMessages: false,
          save: sinon.stub().resolves()
        };
  
        const req = {
          body: {
            username: mockUser.username,
            id: mockItem._id.toString(), // convert to string to match your schema
          },
        };
  
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub(),
        };
  
        sinon.stub(User, 'findOne').onCall(0).resolves(mockUser);
        sinon.stub(Item, 'findOne').resolves(mockItem);
  
        await addFavoriteItem(req, res);
  
        expect(res.json.firstCall.args[0]).to.deep.equals([req.body.id]);
        //expect(res.json.calledWith([mockItem._id.toString()])).to.be.true; // compare with string format id
      });
  

    it('should return an error if the user is not found', async () => {
        const req = {
            body: {
                username: 'testuser',
                id: 'testitemid',
            },
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, 'findOne').resolves(null);

        await addFavoriteItem(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
    });

    // Add more test cases for different scenarios
});


// User Story 4: Item Details Page
describe('getItemById', () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it('should return the item if it is found', async () => {
      const mockItem = {
        _id: new Types.ObjectId(),
        pictures: ["image1.jpg", "image2.jpg"],
        sellerUsername: 'testuser',
        sellerFullName: 'Test User',
        description: 'An item description',
        userDescription: 'An user description',
        price: 100,
        size: '38',
        itemLocation: 'Location',
        category: 'dresses',
        condition: 'new',
        color: 'red',
        brand: 'test-brand',
        isBought: false,
        time: Date.now(),
        likes: [],
        labels: [],
      };
  
      const req = {
        query: {
          id: mockItem._id.toString(),
        },
      };
  
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      sinon.stub(Item, 'findOne').resolves(mockItem);
  
      await getItemById(req, res);
  
      expect(res.json.firstCall.args[0]).to.deep.equals(mockItem);

    });
  
    it('should return an error if the item is not found', async () => {
      const req = {
        query: {
          id: 'nonexistentitemid',
        },
      };
  
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      sinon.stub(Item, 'findOne').resolves(null);
  
      await getItemById(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Item not found' })).to.be.true;
    });
  });



  

//User Story 2: Item Buying
describe('buyItem', () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it('should allow the user to buy the item if all conditions are met', async () => {
        const mockUser = {
            _id: new Types.ObjectId(),
            username: 'testuser',
            fullName: 'Test User',
            email: 'testuser@example.com',
            password: 'password',
            picturePath: 'user.jpg',
            friends: [],
            myUploads: [],
            myBoughts: [],
            favItems: [],
            following: [],
            followers: [],
            city: 'Test city',
            size: '38',
            credit: 30,
            hasUnreadMessages: false,
            save: sinon.stub().resolvesThis() 
          };
        const mockSeller =  {
            _id: new Types.ObjectId(),
            username: 'testuser2',
            fullName: 'Test User2',
            email: 'testuser2@example.com',
            password: 'password2',
            picturePath: 'user2.jpg',
            friends: [],
            myUploads: [],
            myBoughts: [],
            favItems: [],
            following: [],
            followers: [],
            city: 'Test city2',
            size: '38',
            credit: 30,
            hasUnreadMessages: false,
            save: sinon.stub().resolvesThis() 
        };
        const mockItem = {
            _id: new Types.ObjectId(),
            pictures: ["image1.jpg", "image2.jpg"],
            sellerUsername: 'testuser',
            sellerFullName: 'Test User',
            description: 'An item description',
            userDescription: 'An user description',
            price: 10,
            size: '38',
            itemLocation: 'Location',
            category: 'dresses',
            condition: 'new',
            color: 'red',
            brand: 'test-brand',
            isBought: false,
            time: Date.now(),
            likes: [],
            labels: [],
            save: sinon.stub().resolvesThis() 
          };
  
      const req = { body: { username: mockUser.username, sellerUsername: mockSeller.username, itemId: mockItem._id.toString(), price: mockItem.price } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
      sinon.stub(User, 'findOne').onFirstCall().resolves(mockUser).onSecondCall().resolves(mockSeller);
      sinon.stub(Item, 'findOne').resolves(mockItem);
  
      await buyItem(req, res);
  
      //expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equals({ message: 'Item bought successfully' });
      //expect(res.json.calledWith({ message: 'Item bought successfully' })).to.be.true;
    });

    it('should not allow user to buy the item over his price', async () => {
        const mockUser = {
            _id: new Types.ObjectId(),
            username: 'testuser',
            fullName: 'Test User',
            email: 'testuser@example.com',
            password: 'password',
            picturePath: 'user.jpg',
            friends: [],
            myUploads: [],
            myBoughts: [],
            favItems: [],
            following: [],
            followers: [],
            city: 'Test city',
            size: '38',
            credit: 30,
            hasUnreadMessages: false,
            save: sinon.stub().resolves()
          };
        const mockSeller =  {
            _id: new Types.ObjectId(),
            username: 'testuser2',
            fullName: 'Test User2',
            email: 'testuser2@example.com',
            password: 'password2',
            picturePath: 'user2.jpg',
            friends: [],
            myUploads: [],
            myBoughts: [],
            favItems: [],
            following: [],
            followers: [],
            city: 'Test city2',
            size: '38',
            credit: 30,
            hasUnreadMessages: false,
            save: sinon.stub().resolves()
        };
        const mockItem = {
            _id: new Types.ObjectId(),
            pictures: ["image1.jpg", "image2.jpg"],
            sellerUsername: 'testuser',
            sellerFullName: 'Test User',
            description: 'An item description',
            userDescription: 'An user description',
            price: 100,
            size: '38',
            itemLocation: 'Location',
            category: 'dresses',
            condition: 'new',
            color: 'red',
            brand: 'test-brand',
            isBought: false,
            time: Date.now(),
            likes: [],
            labels: [],
          };
  
      const req = { body: { username: mockUser.username, sellerUsername: mockSeller.username, itemId: mockItem._id.toString(), price: mockItem.price } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
      sinon.stub(User, 'findOne').onFirstCall().resolves(mockUser).onSecondCall().resolves(mockSeller);
      sinon.stub(Item, 'findOne').resolves(mockItem);
  
      await buyItem(req, res);
  
      //expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equals({ error: 'Not enough credit' });
      //expect(res.json.calledWith({ message: 'Item bought successfully' })).to.be.true;
    });
  
    // Add more test cases to handle other scenarios, such as item already bought, user not found, not enough credit, seller not found
  });
  
// User Story 6: Viewing Seller's Other Items
describe('getUserItems', () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it('should retrieve a paginated list of user uploaded items', async () => {
      const mockUser = {
        username: 'testuser',
        // Other user fields...
        myUploads: [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()],
      };
      const mockItems = [
        {
          _id: mockUser.myUploads[0],
          pictures: ["image1.jpg", "image2.jpg"],
          sellerUsername: 'testuser',
          sellerFullName: 'Test User',
          description: 'An item description',
          userDescription: 'An user description',
          price: 10,
          size: '38',
          itemLocation: 'Location',
          category: 'dresses',
          condition: 'new',
          color: 'red',
          brand: 'test-brand',
          isBought: false,
          time: Date.now(),
          likes: [],
          labels: [],
        },
        {
          _id: mockUser.myUploads[1],
          pictures: ["image3.jpg", "image4.jpg"],
          sellerUsername: 'testuser',
          sellerFullName: 'Test User',
          description: 'Another item description',
          userDescription: 'Another user description',
          price: 20,
          size: '40',
          itemLocation: 'Location',
          category: 'dresses',
          condition: 'new',
          color: 'blue',
          brand: 'test-brand',
          isBought: false,
          time: Date.now(),
          likes: [],
          labels: [],
        },
        {
          _id: mockUser.myUploads[2],
          pictures: ["image5.jpg", "image6.jpg"],
          sellerUsername: 'testuser',
          sellerFullName: 'Test User',
          description: 'Third item description',
          userDescription: 'Third user description',
          price: 30,
          size: '42',
          itemLocation: 'Location',
          category: 'dresses',
          condition: 'new',
          color: 'green',
          brand: 'test-brand',
          isBought: false,
          time: Date.now(),
          likes: [],
          labels: [],
        },
      ];
  
      const req = { query: { page: '1', limit: '2', userProName: mockUser.username } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
      sinon.stub(User, 'findOne').resolves(mockUser);
      const itemFindStub = sinon.stub(Item, 'find');
      itemFindStub.returns({
        then: function (callback) {
          callback(mockItems);
          return this;
        },
        catch: function () {
          return this;
        },
      });
  
      await getUserItems(req, res);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ items: mockItems.slice(0, 2), totalPages: 2 });
  
      itemFindStub.restore();
    });
  
    it('should return an error if the user is not found', async () => {
      const req = { query: { page: '1', limit: '2', userProName: 'nonexistentuser' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
      sinon.stub(User, 'findOne').resolves(null);
  
      await getUserItems(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
    });
  
    // You can add more test cases for other scenarios, such as when an error is thrown when retrieving items
  });
  



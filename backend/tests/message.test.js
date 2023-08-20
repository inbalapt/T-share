import sinon from 'sinon';
import { expect } from 'chai';
import { getMessages, hasUnreadMessages, postMessage, addNewFriend, uploadImage } from '../controllers/messages.js';
import User from '../models/User.js';


describe('Read Messages', () => {
    afterEach(() => {
        sinon.restore(); // Restore original behavior after each test
      });
    it('should return the messages of a friend', async () => {
        const req = {
        query: {
            username: 'testUser',
            friendUsername: 'friendUser',
        },
        };
        const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        };
        const user = {
        username: 'testUser',
        friends: [
            {
            username: 'friendUser',
            messages: ['Message 1', 'Message 2'],
            },
        ],
        };
    
        // Stub the User.findOne method to resolve with the user object
        const findOneStub = sinon.stub(User, 'findOne');
        findOneStub.resolves(user);
    
        await getMessages(req, res);
    
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ messages: ['Message 1', 'Message 2'] })).to.be.true;
    
        // Restore the stub
        findOneStub.restore();
    });
    
    
    it('should return 404 if user is not found', async () => {
        const req = {
        query: {
            username: 'nonexistentUser',
            friendUsername: 'friendUser',
        },
        };
        const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        };

        // Stub the User.findOne method to resolve with null (user not found)
        const findOneStub = sinon.stub(User, 'findOne');
        findOneStub.resolves(null);

        await getMessages(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ error: 'User not found' })).to.be.true;

        // Restore the stub
        findOneStub.restore();
    });
});


describe('Chat indication', () => {
    afterEach(() => {
        sinon.restore(); // Restore original behavior after each test
      });
    it('should return true if user has unread messages', async () => {
      const req = {
        query: {
          username: 'testUser',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const user = {
        username: 'testUser',
        hasUnreadMessages: true,
      };
  
      // Stub the User.findOne method to resolve with the user object
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.resolves(user);
  
      await hasUnreadMessages(req, res);
  
      console.log(res.status + res.json);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ has: true })).to.be.true;
  
      // Restore the stub
      findOneStub.restore();
    });
  
    it('should return false if user does not have unread messages', async () => {
      const req = {
        query: {
          username: 'testUser',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const user = {
        username: 'testUser',
        hasUnreadMessages: false,
      };
  
      // Stub the User.findOne method to resolve with the user object
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.resolves(user);
  
      await hasUnreadMessages(req, res);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ has: false })).to.be.true;
  
      // Restore the stub
      findOneStub.restore();
    });
  
});


describe('Send Message', () => {
    afterEach(() => {
      sinon.restore();
    });
  
  
    it('should add a new message to the friend\'s messages array', async () => {
        const req = {
        body: {
            message: encodeURIComponent(JSON.stringify({ text: 'Hello' })),
            username: 'testUser',
            friendUsername: 'friendUser',
            hasUnreadMessages: 1,
        },
        };
    
        const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        };
    
        const user = {
        username: 'testUser',
        friends: [
            {
            username: 'friendUser',
            messages: [],
            },
        ],
        save: sinon.stub().resolves(),
        };
    
        // Stub the User.findOne method to resolve with the user object
        const findOneStub = sinon.stub(User, 'findOne');
        findOneStub.resolves(user);
    
        // Call the postMessage function
        await postMessage(req, res);
    
        // Check that res.status and res.json were called correctly
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'Message created successfully', user })).to.be.true;
    
        // Check the updated friend's messages array
        expect(user.friends[0].messages.length).to.equal(1);
        expect(user.friends[0].messages[0]).to.deep.equal({ text: 'Hello' });
    
        // Check the user's hasUnreadMessages value
        expect(user.hasUnreadMessages).to.be.undefined;
    
        // Check that the user's save method was called
        expect(user.save.calledOnce).to.be.true;
    });
        it('should handle errors and return a server error response', async () => {
        const req = {
            body: {
            message: encodeURIComponent(JSON.stringify({ text: 'Hello' })),
            username: 'testUser',
            friendUsername: 'friendUser',
            hasUnreadMessages: 1,
            },
        };
    
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    
        // Stub the User.findOne method to throw an error
        const findOneStub = sinon.stub(User, 'findOne');
        findOneStub.rejects(new Error('Database error'));
    
        // Call the postMessage function
        await postMessage(req, res);
    
        // Check the response
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ error: 'Server error' })).to.be.true;
        });
    });

describe('Adding a new chat', () => {
    afterEach(() => {
        sinon.restore();
      });
    it('should add a new friend to the user\'s friend list', async () => {
        const req = {
          body: {
            username: 'testUser',
            friendUsername: 'friendUser',
            content: 'Hello',
            type: 'text',
            createdAt: '2023-06-18T00:00:00Z',
          },
        };
      
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub(),
        };
      
        const user = {
          username: 'testUser',
          friends: [],
          save: sinon.stub().resolves(),
        };
      
        const friendUser = {
          username: 'friendUser',
          friends: [],
          hasUnreadMessages: false,
          save: sinon.stub().resolves(),
        };
      
        // Stub the User.findOne method for both user and friendUser
        const findOneStub = sinon.stub(User, 'findOne');
        findOneStub.withArgs({ username: 'testUser' }).resolves(user);
        findOneStub.withArgs({ username: 'friendUser' }).resolves(friendUser);
      
        // Call the addNewFriend function
        await addNewFriend(req, res);
      
        // Check that res.status and res.json were called correctly
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith({ success: true, message: 'Friend added successfully' })).to.be.true;
      
        // Check the updated user's friends array
        expect(user.friends.length).to.equal(1);
        expect(user.friends[0]).to.deep.equal({
          username: 'friendUser',
          messages: [
            {
              sender: true,
              msgType: 'text',
              content: 'Hello',
              createdAt: '2023-06-18T00:00:00Z',
            },
          ],
        });
      
        // Check the updated friendUser's friends array
        expect(friendUser.friends.length).to.equal(1);
        expect(friendUser.friends[0]).to.deep.equal({
          username: 'testUser',
          messages: [
            {
              sender: false,
              msgType: 'text',
              content: 'Hello',
              createdAt: '2023-06-18T00:00:00Z',
            },
          ],
        });
      
        // Check that the user and friendUser objects were saved
        expect(user.save.calledOnce).to.be.true;
        expect(friendUser.save.calledOnce).to.be.true;
      
        // Check that the hasUnreadMessages flag was set to true for friendUser
        expect(friendUser.hasUnreadMessages).to.be.true;
      });
      
      it('should return a server error if an exception occurs', async () => {
        const req = {
          body: {
            username: 'testUser',
            friendUsername: 'friendUser',
            content: 'Hello',
            type: 'text',
            createdAt: '2023-06-18T00:00:00Z',
          },
        };
      
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub(),
        };
      
        // Stub the User.findOne method to throw an error
        const findOneStub = sinon.stub(User, 'findOne');
        findOneStub.throws(new Error('Database error'));
      
        // Call the addNewFriend function
        await addNewFriend(req, res);
      
        // Check that res.status and res.json were called correctly
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWith({ error: 'Server error' })).to.be.true;
      });
      
});


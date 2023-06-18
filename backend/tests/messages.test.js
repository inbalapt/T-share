import multer from 'multer';
import fs from 'fs';
import path from 'path';


// User Story 7: Send Pictures
test("Should send an image in a chat", async () => {
  const imagePath = path.join(__dirname, './fixtures/test-image.jpg'); // Assuming this image file is in your fixtures directory
  const image = fs.readFileSync(imagePath);
  const mockFile = new multer.memoryStorage().getBuffer(image);

  const res = await request(app)
    .post("/uploadImage")
    .attach("image", mockFile, "test-image.jpg")
    .query({ myUsername: userOne.username, friendUsername: userTwo.username, time: new Date() })
    .expect(200);

  // Check if the image file was uploaded successfully
  expect(res.body).toBeTruthy();
});

// User Story 8: Chat Indication

test("Should check for unread messages", async () => {
    await request(app)
      .get("/hasUnreadMessages")
      .query({ username: userOne.username })
      .expect(200)
      .then((res) => {
        expect(res.body.has).toBe(true); // Assuming that the user has unread messages
      });
  });



// User Story 9: Read Message and User Story 10: Send Message
test("Should send and read messages", async () => {
    // Send message
    const newMessage = {
      sender: true,
      msgType: "text",
      content: "Hello there!",
      createdAt: new Date(),
    };
    
    const res = await request(app)
      .post("/messages")
      .send({
        message: encodeURIComponent(JSON.stringify(newMessage)),
        username: userOne.username,
        friendUsername: userTwo.username,
        hasUnreadMessages: 2,
      })
      .expect(200);
  
    // Check if the message was sent successfully
    expect(res.body.message).toBe('Message created successfully');
  
    // Check if the message was added to the user's messages array
    const user = await User.findOne({ username: userOne.username });
    const friend = user.friends.find((friend) => friend.username === userTwo.username);
    expect(friend.messages).toContainEqual(newMessage);
  
    // Read message
    const friendUser = await User.findOne({ username: userTwo.username });
    const userFriend = friendUser.friends.find((friend) => friend.username === userOne.username);
    expect(userFriend.messages).toContainEqual(newMessage);
  });



  
// User Story 11: Sending Videos
  test('Should allow users to send videos', async () => {
    // Prepare request with relevant parameters
    const myUsername = 'testUser1';
    const friendUsername = 'testUser2';
    const testFile = 'path_to_video_file.mp4';
    const response = await request(app)
        .post('/uploadVideo')
        .set('Content-Type', 'multipart/form-data')
        .field('myUsername', myUsername)
        .field('friendUsername', friendUsername)
        .attach('video', testFile);

    // Assert that the response is as expected
    expect(response.status).toBe(200);

    // Fetch the users from the database
    const user = await User.findOne({ username: myUsername });
    const friend = await User.findOne({ username: friendUsername });

    // Check that the video has been added to the chat of both the sender and receiver
    const userChat = user.friends.find(friend => friend.username === friendUsername);
    expect(userChat.messages.some(message => message.msgType === 'video')).toBe(true);

    const friendChat = friend.friends.find(friend => friend.username === myUsername);
    expect(friendChat.messages.some(message => message.msgType === 'video')).toBe(true);
});



// User Story 12: Friend Request Acknowledgement - Error Case
test('Should return error if friend is already added', async () => {
    // Prepare request with relevant parameters
    const username = 'testUser1';
    const friendUsername = 'testUser2';
    const content = 'Friend request accepted!';
    const type = 'text';
    const createdAt = new Date();
    
    // Make initial friend request
    await request(app)
        .post('/addNewFriend')
        .send({
            username,
            friendUsername,
            content,
            type,
            createdAt
        });

    // Make duplicate friend request
    const response = await request(app)
        .post('/addNewFriend')
        .send({
            username,
            friendUsername,
            content,
            type,
            createdAt
        });

    // Assert that the response is as expected
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Friend already in friends list');
});

import request from 'supertest';
//import app from "../app";
import User from "../models/User";
import Item from "../models/Item";
import { userOne, userTwo, itemOne } from "./fixtures/db";
import express from "express";
import bodyParser from "body-parser";

//dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());


// Item Listing
describe("Item Listing", () => {
    it("should allow a user to upload an item for sale", async () => {
      const res = await request(server)
        .post('/uploadItem')
        .set('Authorization', `Bearer ${token}`)
        .field('username', 'maya123')
        .field('description', 'This is a test item')
        .field('price', 100)
        .field('size', 'L')
        .field('category', 'Electronics')
        .field('condition', 'New')
        .field('color', 'Red')
        .field('brand', 'Test Brand')
        .attach('images', fs.readFileSync('./test/img/test-image.jpg'), 'test-image.jpg');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("description", "This is a test item");
    });
  });
  
  
  
  
// Initialize the database before each test
//beforeEach(setupDatabase);

//User Story 2: Item Buying
test("Should buy an item successfully", async () => {
  await request(app)
    .post("/buyItem")
    .send({
      username: userOne.username,
      sellerUsername: userTwo.username,
      itemId: itemOne._id,
      price: itemOne.price,
    })
    .expect(200);

  // Assert that the user's credit was deducted
  const user = await User.findOne({ username: userOne.username });
  expect(user.credit).toBe(userOne.credit - itemOne.price);

  // Assert that the item's isBought field is now true
  const item = await Item.findById(itemOne._id);
  expect(item.isBought).toBe(true);
});


// User Story 3: Item Searching
test("Should autocomplete item search", async () => {
    await request(app)
      .get("/autocomplete")
      .query({ term: "red", username: userOne.username })
      .expect(200)
      .then((res) => {
        // Check that the results array is not empty
        expect(res.body.results.length).toBeGreaterThan(0);
        // Check that the items returned match the search term
        res.body.results.forEach((item) => {
          expect(item.description.toLowerCase()).toContain("red");
        });
      });
  });



 // User Story 4: Item Details Page

 test("Should get item details", async () => {
    await request(app)
      .get("/getItemById")
      .query({ id: itemOne._id })
      .expect(200)
      .then((res) => {
        // Check that the item details match the expected details
        expect(res.body._id).toBe(itemOne._id);
        expect(res.body.description).toBe(itemOne.description);
        expect(res.body.price).toBe(itemOne.price);
      });
  });

  
  //User Story 5: Add to Favorites

  test("Should add item to favorites", async () => {
    await request(app)
      .post("/addFavoriteItem")
      .send({ username: userOne.username, id: itemOne._id })
      .expect(200);
  
    // Assert that the item was added to the user's favorites
    const user = await User.findOne({ username: userOne.username });
    expect(user.favItems).toContain(itemOne._id);
  });

  
  // User Story 6: Viewing Seller's Other Items
  test("Should get seller's items", async () => {
    await request(app)
      .get("/getUserItems")
      .query({ page: 1, limit: 10, userProName: userOne.username })
      .expect(200)
      .then((res) => {
        // Check that the results array is not empty
        expect(res.body.items.length).toBeGreaterThan(0);
        // Check that the items returned belong to the seller
        res.body.items.forEach((item) => {
          expect(item.sellerUsername).toBe(userOne.username);
        });
      });
  });
  
  
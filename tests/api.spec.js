require('dotenv').config();
const axios = require('axios');
const { SERVER_ADDRESS = 'http://localhost:', PORT = 3000 } = process.env;
const API_URL = process.env.API_URL || SERVER_ADDRESS + PORT;


const { rebuildDB, testDB } = require('../db/seed_data');
const { client } = require('../db');

const apiSetup = async () => {
  const catsToCreate = [
    {
      username: "Fuzz Ball",
      password: "iamverycuddly",
      email: "lots-a-cuddles@email.com",
      age: 2,
    }
  ]
  const catsCreatedDirectly = await Promise.all(catsToCreate.map(async ({username, password, email, age}) => {
    const {rows: [catCreated]} = await client.query(`
      INSERT INTO cats (username, password, email, age) VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [username, password, email, age]);
    delete catCreated.password;
    return catCreated;
  }));
}

describe('API', () => {
  const tripToPost = { title: "Bavaria", description: 'See the sights in this beautiful country' };
  let postedTripResponse;
  beforeAll(async() => {
    await client.connect();
    await rebuildDB();
    await apiSetup();
  })
  afterAll(async() => {
    await client.end();
  })
  describe('GET request for /api/cats', () => {
    let response, allCatsResponse, allCatsQueried, singleCatResponse, singleCatQueried;
    beforeAll(async() => {
      const {data} = await axios.get(`${API_URL}/api/cats`);
      response = data;
      const {rows} = await client.query(`
        SELECT * FROM cats
      `);
      allCatsQueried = rows;
      allCatsResponse = response.cats;
      [singleCatResponse] = allCatsResponse;
      [singleCatQueried] = allCatsQueried;
    })
    it('Responds with an object with property, `cats`, which is an array.', async () => {
      expect(response).toEqual(expect.objectContaining({
        cats: expect.any(Array),
      }));
    });
    it('cats array should have all cats', async () => {
      expect(allCatsResponse.length).toBe(allCatsQueried.length);
    });
    it('cats should reflect those in the database', async () => {
      expect(singleCatResponse).toEqual(expect.objectContaining({
        id: expect.any(Number),
        username: expect.any(String),
        password: expect.any(String),
        email: expect.any(String),
        age: expect.any(Number),
      }));
      expect(singleCatResponse.description).toEqual(singleCatQueried.description);
      expect(singleCatResponse.title).toEqual(singleCatQueried.title);
      expect(singleCatResponse.location).toEqual(singleCatQueried.location);
    });
  });
  describe('POST request for /api/trips', () => {
    beforeAll(async() => {
    })
    it('on caught error, call next(error), which sends back a 500 error', async () => {
      await expect(axios.post(`${API_URL}/api/trips`, {nothing: undefined})).rejects.toThrow('Request failed with status code 500');
    });
    it('on success, it should send back the object returned by createCat', async () => {
      const {data} = await axios.post(`${API_URL}/api/trips`, tripToPost);
      postedTripResponse = data;
      expect(postedTripResponse.title).toBe(tripToPost.title);
      expect(postedTripResponse.description).toBe(tripToPost.description);
    });
  });
});

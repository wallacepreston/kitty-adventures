require('dotenv').config();

const { rebuildDB } = require('../db/seed_data');
const {
  client,
  createCat,
} = require('../db');

describe('Database', () => {
  beforeAll(async() => {
    await client.connect();
    await rebuildDB();
  })
  afterAll(async() => {
    await client.end();
  })
  describe('Cats', () => {
    let testCat, testCat2;
    describe('createCat', () => {
      beforeAll(async() => {
        testCat = await createCat({
          username: 'Clawdia',
          password: 'hurtfulhugs',
          email: 'hugs@email.com',
          age: 4
        });
        testCat2 = {
          username: "Mr Fluffers",
          password: "iamfluffy",
          email: "fluffs@email.com",
          age: 5,
        }
      })
      it('Returns an object', async () => {
        expect(typeof testCat).toBe('object');
      });
      it('cat object contains name, username, email, age', async () => {
        expect(testCat).toEqual(expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
          password: expect.any(String),
          email: expect.any(String),
          age: expect.any(Number),
        }));
      });
      it('inserts this cat into the db', async () => {
        const insertedCat = await createCat(testCat2);
        console.log('insertedCat: ', insertedCat);
        
        const {rows: [queriedCat]} = await client.query(`
          SELECT * FROM cats
          WHERE username=$1
        `, [testCat2.username]);
        expect(queriedCat).toEqual(expect.objectContaining({
          id: expect.any(Number),
        }));
        expect(insertedCat).toEqual(queriedCat);
      });
    });
  });
});

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
    let testCat;
    describe('createCat', () => {
      beforeAll(async() => {
        testCat = await createCat({
          username: 'Clawdia',
          password: 'hurtfulhugs'
        });
      })
      it('Returns an object', async () => {
        expect(typeof testCat).toBe('object');
      });
      it('cat object contains name, username', async () => {
        expect(testCat).toEqual(expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
          password: expect.any(String),
        }));
      });
    });
  });
});

require('dotenv').config();

const { sayHelloTo } = require('../utils');

describe('Utils', () => {
  describe('Cats', () => {
    const testCat = {
      username: 'Clawdia',
      password: 'hurtfulhugs'
    };
    const testCatTwo = {
      username: 'FuzzBall',
      password: 'verysoftfur'
    };
    describe('sayHelloTo', () => {
      it('Returns a string', async () => {
        expect(typeof sayHelloTo(testCat)).toBe('string');
      });
      it('returned string contains cat username', async () => {
        expect(sayHelloTo(testCat).includes(testCat.username)).toBe(true);
      });
      it('returned string is formatted correctly', async () => {
        expect(sayHelloTo(testCat)).toEqual('Hello Clawdia');
      });
      it('returned string is formatted correctly', async () => {
        expect(sayHelloTo(testCatTwo)).toEqual('Hello FuzzBall');
      });
    });
  });
});

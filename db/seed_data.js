const cats = [
  {
    username: "Katy Purry",
    password: "iamasinga",
    email: "singa@email.com",
    age: 5,
  },
  {
    username: "Kit-Kat",
    password: "ilikechocolate",
    email: "choco-cat@email.com",
    age: 6,
  },
  {
    username: "Cindy Clawford",
    password: "clawsamany",
    email: "claws-a-many@email.com",
    age: 6,
  },
  {
    username: "Clawdia Catzy",
    password: "hurtfulhugs",
    email: "hurtful-hugs@email.com",
    age: 4,
  },
  {
    username: "Ricky Ticky Tabby",
    password: "callmetabs",
    email: "call-me-tabs@email.com",
    age: 7,
  },
  {
    username: "Bitty Billy Bubbles",
    password: "lotsabubs",
    email: "lotsa-bubs@email.com",
    age: 1,
  },
  {
    username: "Quimby mcQuimbleson",
    password: "quivermytimbers",
    email: "quiver-my-timbers@email.com",
    age: 2,
  }
];

const util = require('util');

const { client, createCat } = require('./index');


const dropTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS trips;
      DROP TABLE IF EXISTS cats;
    `);
  } catch (error) {
    console.error(error)
  }
}

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE cats (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        age INT
      );
    `);
    await client.query(`
      CREATE TABLE trips (
        id SERIAL PRIMARY KEY,
        "catId" INTEGER REFERENCES cats(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);
  } catch (error) {
    console.error(error);
  }
}
const createInitialData = async () => {
  try {
    // the same as await createCat(cats[0])...
    await Promise.all(cats.map( createCat ));
    
  } catch (error) {
    console.error(error);
  }

}

async function testDB() {
  try {
    // connect the client to the database, finally
    await createCat({username: "Katy Purry", password: "iamasinga",});
    await Promise.all(cats.map(cat => createCat(cat)))

    // this is why interpolating is NOT a good idea
    const nefariousKitten = {
      username: 'buster',
      password: "ibustyourdb'); DROP TABLE cats; --",
      age: 6
    };

    // if we had not used bind variables `$1` the cats table would be dropped in the above example.
    const createdNefarious = await createCat(nefariousKitten);
    console.log('createdNefarious: ', createdNefarious);
    
  } catch (error) {
    console.error(error);
  } finally {
    // it's important to close out the client connection
    client.end();
  }
}

const rebuildDB = async () => {
  await dropTables();
  await createTables();
  await createInitialData();
}

module.exports = {
  rebuildDB,
  testDB
}
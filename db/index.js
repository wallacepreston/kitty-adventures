// We need to connect to our database in js
const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/adventures-dev');

const createCat = async ({username, password, email, age}) => {
  try {
    const {rows: [cat]} = await client.query(`
      INSERT INTO cats (username, password, email, age) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [username, password, email, age]);
    return cat;
  } catch (error) {
    console.error(error)
  }
}

const getAllCats = async () => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM cats
    `);
    
    return rows;
  } catch (error) {
    console.error(error);
  }
}

const createTrip = async ({catId, title, description}) => {
  try {
    const {rows: [trip]} = await client.query(`
      INSERT INTO trips("catId", title, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [catId, title, description]);
    console.log('trip: ', trip);
    
    return trip;
  } catch (error) {
    console.error(error)
  }
}



module.exports = {
  client,
  createCat,
  getAllCats,
  createTrip,
}
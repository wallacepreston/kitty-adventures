// We need to connect to our database in js
const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/adventures-dev');

const createCat = async () => {
  
}

const getAllCats = async () => {
  
}

const createTrip = async () => {

}



module.exports = {
  client,
  createCat,
  getAllCats,
  createTrip,
}
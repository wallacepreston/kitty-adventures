// Build an apiRouter using express Router
const apiRouter = require('express').Router();

// Import the database adapter functions from the db
const {
  getAllCats,
  createTrip,
} = require('../db');

// GET /api/cats

// POST /api/trips

// Export the apiRouter
module.exports = apiRouter;

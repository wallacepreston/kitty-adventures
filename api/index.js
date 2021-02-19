// Build an apiRouter using express Router
const apiRouter = require('express').Router();

// Import the database adapter functions from the db
const {
  getAllCats,
  createTrip,
} = require('../db');

// GET /api/cats
apiRouter.get('/cats', async (req, res, next) => {
  try {
    const cats = await getAllCats();
    res.send({cats});
  } catch (error) {
    console.error(error);
    next(error)
  }
})

// POST /api/trips
apiRouter.post('/trips', async (req, res, next) => {
  try {
    const trip = req.body;
    const tripCreated = await createTrip(trip);
    if (tripCreated) {
      res.send(tripCreated);
    } else {
      next({message: 'cannot create Trip'})
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
})

// Export the apiRouter
module.exports = apiRouter;

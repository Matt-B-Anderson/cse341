const express = require('express');
const router = express.Router();
const movieRatingController = require('../controllers/movieRating');
const {isAuthenticated} = require("../middleware/authenticate");

router.get('/', movieRatingController.getAll);
router.get('/:id', movieRatingController.getById);
router.post('/', isAuthenticated, movieRatingController.createMovieRating);
router.put('/:id', isAuthenticated, movieRatingController.updateMovieRating);
router.delete('/:id', isAuthenticated, movieRatingController.deleteMovieRating);

module.exports = router;
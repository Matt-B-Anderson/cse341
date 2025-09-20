const express = require('express');
const router = express.router();
const movieRatingController = require('../controllers/movieRating');

router.get('/', movieRatingController.getAll);
router.get('/:id', movieRatingController.getById);
router.post('/', movieRatingController.createMovieRating);
router.put('/:id', movieRatingController.updateMovieRating);
router.delete('/:id', movieRatingController.deleteMovieRating);

module.exports = router;
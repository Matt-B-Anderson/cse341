const routes = require('express').Router();
const movieRating = require('./movieRating');

routes.use('/', require('./swagger'));
routes.use('/movieRating', movieRating);

module.exports = routes;
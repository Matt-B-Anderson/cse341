const routes = require('express').Router();

routes.use('/', require('./swagger'));
routes.use('/movieRating', movieRating);

module.exports = routes;
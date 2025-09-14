const routes = require('express').Router();
const contacts = require('./contacts');
const professional = require('./professional');

routes.use('/', require('./swagger'));
routes.use('/contacts', contacts);
routes.use('/professional', professional);

module.exports = routes;
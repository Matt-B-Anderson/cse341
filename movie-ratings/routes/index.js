const routes = require('express').Router();
const movieRating = require('./movieRating');
const passport = require('passport');

routes.use('/', require('./swagger'));
routes.use('/movieRating', movieRating);
routes.get('/login', passport.authenticate('github'), (req, res) => {});
routes.get('/logout', function(req, res, next) {
    req.logOut(function(err) {
        if (err) {return next(err); }
        res.redirect('/');
    });
});

module.exports = routes;
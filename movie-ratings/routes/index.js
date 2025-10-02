const routes = require('express').Router();
const movieRating = require('./movieRating');
const passport = require('passport');

routes.use('/', require('./swagger'));
routes.use('/movieRating', movieRating);
routes.get('/login', passport.authenticate('github'));
routes.use('/watchlist', watchlist);
routes.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    res.redirect('/');
  }
);
routes.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(req.user);
});
routes.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = routes;
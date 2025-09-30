const routes = require('express').Router();
const movieRating = require('./movieRating');
const passport = require('../auth');

routes.use('/', require('./swagger'));
routes.use('/movieRating', movieRating);

routes.get('/login', passport.authenticate('github'));

routes.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login-failed' }),
  (req, res) => {
    res.redirect('/');
  }
);

routes.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', (err, user, info) => {
    if (err) {
      console.error('GitHub auth ERROR:', err);
      return res.status(500).send('Auth error');
    }
    if (!user) {
      console.error('GitHub auth FAILED. info=', info);
      return res.redirect('/login-failed');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login (serialize) error:', err);
        return res.status(500).send('Login error');
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

routes.get('/login-failed', (_req, res) => res.status(401).send('Login failed'));

routes.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session?.destroy(() => {
      res.clearCookie('connect.sid', { path: '/' });
      res.redirect('/');
    });
  });
});

module.exports = routes;

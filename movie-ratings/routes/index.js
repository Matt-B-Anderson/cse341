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

routes.get('/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = req.user || {};
  res.json({
    user: {
      _id: user._id,
      githubId: user.githubId,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    }
  });
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

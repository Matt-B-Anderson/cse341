const routes = require('express').Router();
const movieRating = require('./movieRating');
const passport = require('passport');

routes.use('/', require('./swagger'));
routes.use('/movieRating', movieRating);
routes.get('/login', passport.authenticate('github'));
routes.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/', session: false }),
    (req, res) => {
        const payload = {
            sub: req.user._id.toString(),
            githubId: req.user.githubId,
            username: req.user.username
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            issuer: 'movie-ratings-api'
        });

        res.json({
            token,
            user: {
                _id: req.user._id,
                githubId: req.user.githubId,
                username: req.user.username,
                displayName: req.user.displayName,
                avatarUrl: req.user.avatarUrl
            },
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });
    }
);
routes.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    res.json(req.user);
});
routes.get('/logout', (req, res, next) => {
    req.logout?.(err => {
        if (err) return next(err);
        req.session?.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

module.exports = routes;
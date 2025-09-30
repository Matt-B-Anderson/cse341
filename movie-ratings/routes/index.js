const routes = require('express').Router();
const movieRating = require('./movieRating');
const passport = require('../auth');
const jwt = require('jsonwebtoken');

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

        res.redirect(`/auth/finalize?token=${encodeURIComponent(token)}`);
    }
);

routes.get('/auth/finalize', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send('Missing token');

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 3600 * 1000
    });

    res.redirect('/');
});

routes.get('/me', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, bearer] = authHeader.split(' ');
    const token = (scheme === 'Bearer' && bearer) ? bearer : req.cookies?.token;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'movie-ratings-api' });
        res.json({ user: decoded });
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
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

routes.get('/auth/token', (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No token cookie' });
    return res.json({ token });
});

module.exports = routes;
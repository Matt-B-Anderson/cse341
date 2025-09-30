const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, bearer] = authHeader.split(' ');
    const token = (scheme === 'Bearer' && bearer) ? bearer : req.cookies?.token;

    if (!token) return res.status(401).json({ error: 'Missing auth token' });

    try {
        req.auth = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'movie-ratings-api' });
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { isAuthenticated: authenticateJWT };
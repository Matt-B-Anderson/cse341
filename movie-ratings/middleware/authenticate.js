const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const hdr = req.headers.authorization || '';
    const [scheme, token] = hdr.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'movie-ratings-api' });
        req.auth = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { isAuthenticated: authenticateJWT };
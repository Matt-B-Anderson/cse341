// routes/watchlist.js
const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authenticate');
const controller = require('../controllers/watchlist');

router.get('/', isAuthenticated, controller.list);

router.post('/', isAuthenticated, controller.create);

router.patch('/:id', isAuthenticated, controller.update);

router.delete('/:id', isAuthenticated, controller.remove);

router.get('/stats', isAuthenticated, controller.stats);

module.exports = router;

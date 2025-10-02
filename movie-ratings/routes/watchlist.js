const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authenticate');
const controller = require('../controllers/watchlist.js');

router.get('/', isAuthenticated, controller.getList);

router.post('/', isAuthenticated, controller.create);

router.put('/:id', isAuthenticated, controller.update);

router.delete('/:id', isAuthenticated, controller.remove);

router.get('/stats', isAuthenticated, controller.getStats);

module.exports = router;

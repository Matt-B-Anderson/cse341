const express = require('express');

const contactsController = require('../controllers/contacts');

const router = express.Router();

router.get('/', contactsController.getAll);
router.get('/contact:id', contactsController.getById);

module.exports = router;
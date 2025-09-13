const express = require('express');

const contactsController = require('../controllers/contacts');

const router = express.Router();

router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getById);
router.post('/', contactsController.createContact);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
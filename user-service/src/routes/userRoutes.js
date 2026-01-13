const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.register.bind(userController));
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));

module.exports = router;
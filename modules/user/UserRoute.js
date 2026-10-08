const express = require('express');
const router = express.Router();
const userController = require('./UserController');
const { verifyToken, isAdmin } = require('../../middleware/auth');

router.post('/', userController.createUser);
router.post('/login', userController.login);

router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.patch('/:id', verifyToken, userController.updateUserById);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
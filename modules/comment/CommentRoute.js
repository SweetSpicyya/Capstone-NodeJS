const express = require('express');
const router = express.Router();
const commentController = require('./CommentController');
const { verifyToken, isAdmin } = require('../../middleware/auth');

router.get('/', verifyToken, isAdmin, commentController.getAllComments);
router.get('/:id', verifyToken, commentController.getCommentById);
router.get('/user/:userId', verifyToken, commentController.getAllUserComments);
router.post('/', verifyToken, commentController.createComment);
router.patch('/:id', verifyToken, commentController.updateCommentById);
router.delete('/:id', verifyToken, isAdmin, commentController.deleteComment);

module.exports = router;
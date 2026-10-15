const Comment = require('./CommentModule');
const User = require('../user/UserModule');

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('userId', 'email firstname lastname');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('userId', 'email firstname lastname');
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUserComments = async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.params.userId }).populate('userId', 'email firstname lastname');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const commentData = req.body.comment ? req.body.comment : req.body;
        const userId = req.body.userId || commentData.userId || req.user?._id;

        if (!commentData.description) {
            return res.status(400).json({ message: 'Description is required' });
        }

        const newComment = await Comment.create({
            description: commentData.description,
            userId,
        });

        await User.findByIdAndUpdate(userId, {
            $push: { comments: newComment._id },
        });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCommentById = async (req, res) => {
    try {
        const updateData = req.body.comment ? req.body.comment : req.body;

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await User.findByIdAndUpdate(comment.userId, {
            $pull: { comments: comment._id },
        });

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
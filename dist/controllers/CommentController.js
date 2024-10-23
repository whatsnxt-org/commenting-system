"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const Comment_1 = require("../models/Comment");
const config_1 = require("../config");
class CommentController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { content, author, parentId } = req.body;
                const countDoc = yield Comment_1.Comment.countDocuments({ parentId });
                if (parentId && countDoc >= config_1.config.commentDepth) {
                    res.status(400).json({ error: `Maximum nesting depth of ${config_1.config.commentDepth} exceeded` });
                    return;
                }
                const comment = new Comment_1.Comment({ content, author, parentId });
                yield comment.save();
                res.status(201).json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create comment', details: error.message });
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { parentId, limit = '3', offset = '0' } = req.query;
                const comments = yield Comment_1.Comment.find({ parentId })
                    .skip(Number(offset))
                    .limit(Number(limit));
                // Filter out flagged comments (more than 5 flags)
                const visibleComments = comments.filter(comment => comment.flags < 5);
                res.json(visibleComments);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve comments', details: error.message });
            }
        });
    }
    flagComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                // Increment the flags count
                comment.flags += 1;
                // Check if the flags exceed the limit
                if (comment.flags > 5) {
                    comment.isHidden = true; // Hide the comment if flagged more than 5 times
                }
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to flag comment', details: error.message });
            }
        });
    }
    likeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.userId; // Assume userId comes from the request body
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                // Check if user has already liked the comment
                if (comment.likedBy.includes(userId)) {
                    res.status(400).json({ error: 'User has already liked this comment' });
                    return;
                }
                // Increment the likes count and add user to likedBy
                yield comment.adjustLikes(1);
                comment.likedBy.push(userId);
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to like comment', details: error.message });
            }
        });
    }
    unlikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.userId; // Assume userId comes from the request body
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                // Check if user has liked the comment
                const userIndex = comment.likedBy.indexOf(userId);
                if (userIndex === -1) {
                    res.status(400).json({ error: 'User has not liked this comment' });
                    return;
                }
                // Decrement the likes count and remove user from likedBy
                yield comment.adjustLikes(-1);
                comment.likedBy.splice(userIndex, 1);
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to unlike comment', details: error.message });
            }
        });
    }
    dislikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.userId; // Assume userId comes from the request body
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                // Check if user has already disliked the comment
                if (comment.disLikedBy.includes(userId)) {
                    res.status(400).json({ error: 'User has already disliked this comment' });
                    return;
                }
                // Increment the likes count (can go negative) and add user to disLikedBy
                yield comment.adjustLikes(-1); // Decrease likes count
                comment.disLikedBy.push(userId);
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to dislike comment', details: error.message });
            }
        });
    }
    undislikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.userId; // Assume userId comes from the request body
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                // Check if user has disliked the comment
                const userIndex = comment.disLikedBy.indexOf(userId);
                if (userIndex === -1) {
                    res.status(400).json({ error: 'User has not disliked this comment' });
                    return;
                }
                // Increment the likes count and remove user from disLikedBy
                yield comment.adjustLikes(1); // Increase likes count
                comment.disLikedBy.splice(userIndex, 1);
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to undislike comment', details: error.message });
            }
        });
    }
    editComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { content } = req.body;
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                comment.content = content;
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to edit comment', details: error.message });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Find the comment to delete
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                // Delete all child comments
                yield Comment_1.Comment.deleteMany({ parentId: id });
                // Delete the comment itself
                yield Comment_1.Comment.findByIdAndDelete(id);
                res.status(204).send(); // No content to send back
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete comment', details: error.message });
            }
        });
    }
}
exports.CommentController = CommentController;

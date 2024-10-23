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
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */
class CommentController {
    /**
     * @swagger
     * /api:
     *   post:
     *     summary: Create a comment
     *     tags: [Comments]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *               author:
     *                 type: string
     *               parentId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Comment created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
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
    /**
     * @swagger
     * /api:
     *   get:
     *     summary: Get comments
     *     tags: [Comments]
     *     parameters:
     *       - name: parentId
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *       - name: limit
     *         in: query
     *         required: false
     *         schema:
     *           type: integer
     *       - name: offset
     *         in: query
     *         required: false
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of comments
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Comment'
     *       500:
     *         description: Internal server error
     */
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
    /**
     * @swagger
     * /api/{id}/flag:
     *   patch:
     *     summary: Flag a comment
     *     tags: [Comments]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the comment to flag
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Comment flagged
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       404:
     *         description: Comment not found
     *       500:
     *         description: Internal server error
     */
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
                // Hide the comment if flagged more than 5 times
                if (comment.flags > 5) {
                    comment.isHidden = true;
                }
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to flag comment', details: error.message });
            }
        });
    }
    /**
     * @swagger
     * /api/{id}/like:
     *   post:
     *     summary: Like a comment
     *     tags: [Comments]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the comment to like
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Comment liked
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       404:
     *         description: Comment not found
     *       400:
     *         description: User has already liked this comment
     *       500:
     *         description: Internal server error
     */
    likeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
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
    /**
     * @swagger
     * /api/{id}/unlike:
     *   post:
     *     summary: Unlike a comment
     *     tags: [Comments]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the comment to unlike
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Comment unliked
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       404:
     *         description: Comment not found
     *       400:
     *         description: User has not liked this comment
     *       500:
     *         description: Internal server error
     */
    unlikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
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
    /**
     * @swagger
     * /api/{id}/dislike:
     *   post:
     *     summary: Dislike a comment
     *     tags: [Comments]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the comment to dislike
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Comment disliked
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       404:
     *         description: Comment not found
     *       400:
     *         description: User has already disliked this comment
     *       500:
     *         description: Internal server error
     */
    dislikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
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
                // Decrease the likes count and add user to disLikedBy
                yield comment.adjustLikes(-1);
                comment.disLikedBy.push(userId);
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to dislike comment', details: error.message });
            }
        });
    }
    /**
     * @swagger
     * /api/{id}/undislike:
     *   post:
     *     summary: Undislike a comment
     *     tags: [Comments]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the comment to undislike
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Comment undisliked
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       404:
     *         description: Comment not found
     *       400:
     *         description: User has not disliked this comment
     *       500:
     *         description: Internal server error
     */
    undislikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
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
                yield comment.adjustLikes(1);
                comment.disLikedBy.splice(userIndex, 1);
                yield comment.save();
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to undislike comment', details: error.message });
            }
        });
    }
    /**
     * @swagger
     * /api/{id}/edit:
     *   patch:
     *     summary: Edit a comment
     *     tags: [Comments]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the comment to edit
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *     responses:
     *       200:
     *         description: Comment edited
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       404:
     *         description: Comment not found
     *       500:
     *         description: Internal server error
     */
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
    /**
     * @swagger
     * /api/{id}:
     *   delete:
     *     summary: Delete a comment
     *     tags: [Comments]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the comment to delete
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Comment deleted
     *       404:
     *         description: Comment not found
     *       500:
     *         description: Internal server error
     */
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comment = yield Comment_1.Comment.findById(id);
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                // Use deleteOne instead of remove
                yield Comment_1.Comment.deleteOne({ _id: id });
                res.status(204).send(); // No content to return
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete comment', details: error.message });
            }
        });
    }
}
exports.CommentController = CommentController;
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: string
 *         parentId:
 *           type: string
 *         flags:
 *           type: integer
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *         disLikedBy:
 *           type: array
 *           items:
 *             type: string
 *         isHidden:
 *           type: boolean
 */

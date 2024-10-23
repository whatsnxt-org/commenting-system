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
exports.schema = void 0;
const graphql_1 = require("graphql");
const Comment_1 = require("../models/Comment");
const config_1 = require("../config");
/**
 * @typedef {Object} Comment
 * @property {string} id - The unique identifier of the comment
 * @property {string} content - The content of the comment
 * @property {string} author - The ID of the author of the comment
 * @property {string} parentId - The ID of the parent comment, if applicable
 * @property {number} flags - The number of times the comment has been flagged
 * @property {number} likes - The number of likes the comment has received
 * @property {boolean} isHidden - Indicates if the comment is hidden due to flags
 * @property {string} createdAt - The timestamp when the comment was created
 * @property {string} updatedAt - The timestamp when the comment was last updated
 * @property {Array<string>} likedBy - List of user IDs who liked the comment
 * @property {Array<string>} disLikedBy - List of user IDs who disliked the comment
 */
/**
 * Define the Comment type.
 */
const CommentType = new graphql_1.GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        author: { type: graphql_1.GraphQLID },
        parentId: { type: graphql_1.GraphQLID },
        flags: { type: graphql_1.GraphQLInt },
        likes: { type: graphql_1.GraphQLInt },
        isHidden: { type: graphql_1.GraphQLBoolean },
        createdAt: { type: graphql_1.GraphQLString },
        updatedAt: { type: graphql_1.GraphQLString },
        likedBy: { type: new graphql_1.GraphQLList(graphql_1.GraphQLID) },
        disLikedBy: { type: new graphql_1.GraphQLList(graphql_1.GraphQLID) },
    }),
});
/**
 * Define the Root Query for fetching comments.
 * @swagger
 * /graphql:
 *   post:
 *     summary: Fetch comments
 *     description: Fetch comments based on parentId, limit, and offset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: '{ comments(parentId: "123", limit: 5, offset: 0) { id content author flags likes } }'
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        comments: {
            type: new graphql_1.GraphQLList(CommentType),
            args: {
                parentId: { type: graphql_1.GraphQLID },
                limit: { type: graphql_1.GraphQLInt },
                offset: { type: graphql_1.GraphQLInt }
            },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { parentId, limit = 3, offset = 0 }) {
                    const comments = yield Comment_1.Comment.find({ parentId })
                        .skip(offset)
                        .limit(limit);
                    return comments.filter(comment => comment.flags < 5);
                });
            },
        },
    },
});
/**
 * Define the Mutations for managing comments.
 */
const Mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Create a new comment
         *     description: Creates a new comment with the specified content, author, and optional parentId.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { createComment(content: "This is a comment", author: "user123", parentId: "parent123") { id content author } }'
         *     responses:
         *       201:
         *         description: The created comment
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Comment'
         */
        createComment: {
            type: CommentType,
            args: {
                content: { type: graphql_1.GraphQLString },
                author: { type: graphql_1.GraphQLID },
                parentId: { type: graphql_1.GraphQLID },
            },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { content, author, parentId }) {
                    const countDoc = yield Comment_1.Comment.countDocuments({ parentId });
                    if (parentId && countDoc >= config_1.config.commentDepth) {
                        throw new Error(`Maximum nesting depth of ${config_1.config.commentDepth} exceeded`);
                    }
                    const comment = new Comment_1.Comment({ content, author, parentId });
                    return yield comment.save();
                });
            },
        },
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Flag a comment
         *     description: Flags a comment, incrementing its flags count.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { flagComment(id: "comment123") { id flags } }'
         *     responses:
         *       200:
         *         description: The updated comment
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Comment'
         */
        flagComment: {
            type: CommentType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { id }) {
                    const comment = yield Comment_1.Comment.findById(id);
                    if (!comment)
                        throw new Error('Comment not found.');
                    comment.flags += 1;
                    if (comment.flags > 5) {
                        comment.isHidden = true; // Hide comment if flagged more than 5 times
                    }
                    return yield comment.save();
                });
            },
        },
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Like a comment
         *     description: Likes a comment.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { likeComment(id: "comment123", userId: "user123") { id likes likedBy } }'
         *     responses:
         *       200:
         *         description: The updated comment
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Comment'
         */
        likeComment: {
            type: CommentType,
            args: { id: { type: graphql_1.GraphQLID }, userId: { type: graphql_1.GraphQLID } },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { id, userId }) {
                    const comment = yield Comment_1.Comment.findById(id);
                    if (!comment)
                        throw new Error('Comment not found.');
                    const userStringId = userId.toString();
                    if (comment.likedBy.includes(userStringId)) {
                        throw new Error('User has already liked this comment');
                    }
                    yield comment.adjustLikes(1);
                    comment.likedBy.push(userId);
                    return yield comment.save();
                });
            },
        },
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Unlike a comment
         *     description: Unlikes a comment.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { unlikeComment(id: "comment123", userId: "user123") { id likes likedBy } }'
         *     responses:
         *       200:
         *         description: The updated comment
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Comment'
         */
        unlikeComment: {
            type: CommentType,
            args: { id: { type: graphql_1.GraphQLID }, userId: { type: graphql_1.GraphQLID } },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { id, userId }) {
                    const comment = yield Comment_1.Comment.findById(id);
                    if (!comment)
                        throw new Error('Comment not found.');
                    const userStringId = userId.toString();
                    const userIndex = comment.likedBy.indexOf(userStringId);
                    if (userIndex === -1) {
                        throw new Error('User has not liked this comment');
                    }
                    yield comment.adjustLikes(-1);
                    comment.likedBy.splice(userIndex, 1);
                    return yield comment.save();
                });
            },
        },
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Dislike a comment
         *     description: Dislikes a comment.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { dislikeComment(id: "comment123", userId: "user123") { id likes disLikedBy } }'
         *     responses:
         *       200:
         *         description: The updated comment
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Comment'
         */
        dislikeComment: {
            type: CommentType,
            args: { id: { type: graphql_1.GraphQLID }, userId: { type: graphql_1.GraphQLID } },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { id, userId }) {
                    const comment = yield Comment_1.Comment.findById(id);
                    if (!comment)
                        throw new Error('Comment not found.');
                    const userStringId = userId.toString();
                    if (comment.disLikedBy.includes(userStringId)) {
                        throw new Error('User has already disliked this comment');
                    }
                    yield comment.adjustLikes(-1); // Decrease likes count
                    comment.disLikedBy.push(userId);
                    return yield comment.save();
                });
            },
        },
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Undislike a comment
         *     description: Undislikes a comment.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { undislikeComment(id: "comment123", userId: "user123") { id likes disLikedBy } }'
         *     responses:
         *       200:
         *         description: The updated comment
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Comment'
         */
        undislikeComment: {
            type: CommentType,
            args: { id: { type: graphql_1.GraphQLID }, userId: { type: graphql_1.GraphQLID } },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { id, userId }) {
                    const comment = yield Comment_1.Comment.findById(id);
                    if (!comment)
                        throw new Error('Comment not found.');
                    const userStringId = userId.toString();
                    const userIndex = comment.disLikedBy.indexOf(userStringId);
                    if (userIndex === -1) {
                        throw new Error('User has not disliked this comment');
                    }
                    yield comment.adjustLikes(1); // Increase likes count
                    comment.disLikedBy.splice(userIndex, 1);
                    return yield comment.save();
                });
            },
        },
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Edit a comment
         *     description: Edits an existing comment.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { editComment(id: "comment123", content: "Updated comment content") { id content } }'
         *     responses:
         *       200:
         *         description: The updated comment
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Comment'
         */
        editComment: {
            type: CommentType,
            args: {
                id: { type: graphql_1.GraphQLID },
                content: { type: graphql_1.GraphQLString },
            },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { id, content }) {
                    const comment = yield Comment_1.Comment.findById(id);
                    if (!comment)
                        throw new Error('Comment not found.');
                    comment.content = content; // Update the content of the comment
                    return yield comment.save();
                });
            },
        },
        /**
         * @swagger
         * /graphql:
         *   post:
         *     summary: Delete a comment
         *     description: Deletes a comment by its ID.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               query:
         *                 type: string
         *                 example: 'mutation { deleteComment(id: "comment123") }'
         *     responses:
         *       200:
         *         description: A boolean indicating success
         *         content:
         *           application/json:
         *             schema:
         *               type: boolean
         */
        deleteComment: {
            type: graphql_1.GraphQLBoolean,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent_1, _a) {
                return __awaiter(this, arguments, void 0, function* (parent, { id }) {
                    const comment = yield Comment_1.Comment.findById(id);
                    if (!comment)
                        throw new Error('Comment not found.');
                    // Delete all child comments
                    yield Comment_1.Comment.deleteMany({ parentId: id });
                    // Delete the comment itself
                    yield Comment_1.Comment.findByIdAndDelete(id);
                    return true; // Indicate that the deletion was successful
                });
            },
        },
    },
});
// Export the complete schema
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

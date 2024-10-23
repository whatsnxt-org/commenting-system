"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CommentController_1 = require("../controllers/CommentController");
const router = express_1.default.Router();
const commentController = new CommentController_1.CommentController();
router.post('/', (req, res) => commentController.create(req, res));
router.get('/', (req, res) => commentController.getComments(req, res));
router.patch('/:id/flag', (req, res) => commentController.flagComment(req, res));
router.post('/:id/like', (req, res) => commentController.likeComment(req, res)); // Like comment
router.post('/:id/unlike', (req, res) => commentController.unlikeComment(req, res)); // Unlike comment
router.post('/:id/dislike', (req, res) => commentController.dislikeComment(req, res)); // Like comment
router.post('/:id/undislike', (req, res) => commentController.undislikeComment(req, res)); // Unlike comment
router.patch('/:id/edit', (req, res) => commentController.editComment(req, res));
router.delete('/:id', (req, res) => commentController.deleteComment(req, res));
exports.default = router;

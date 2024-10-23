import express, { Router } from 'express';

import { CommentController } from '../controllers/CommentController';

const router: Router = express.Router();
const commentController = new CommentController();

router.post('/', (req, res) => commentController.create(req, res));
router.get('/', (req, res) => commentController.getComments(req, res));
router.patch('/:id/flag', (req, res) => commentController.flagComment(req, res));
router.post('/:id/like', (req, res) => commentController.likeComment(req, res)); // Like comment
router.post('/:id/unlike', (req, res) => commentController.unlikeComment(req, res)); // Unlike comment
router.post('/:id/dislike', (req, res) => commentController.dislikeComment(req, res)); // Like comment
router.post('/:id/undislike', (req, res) => commentController.undislikeComment(req, res)); // Unlike comment
router.patch('/:id/edit', (req, res) => commentController.editComment(req, res));
router.delete('/:id', (req, res) => commentController.deleteComment(req, res))
export default router;

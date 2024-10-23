import { Request, Response } from 'express';
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */
export declare class CommentController {
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
    create(req: Request, res: Response): Promise<void>;
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
    getComments(req: Request, res: Response): Promise<void>;
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
    flagComment(req: Request, res: Response): Promise<void>;
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
    likeComment(req: Request, res: Response): Promise<void>;
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
    unlikeComment(req: Request, res: Response): Promise<void>;
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
    dislikeComment(req: Request, res: Response): Promise<void>;
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
    undislikeComment(req: Request, res: Response): Promise<void>;
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
    editComment(req: Request, res: Response): Promise<void>;
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
    deleteComment(req: Request, res: Response): Promise<void>;
}
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

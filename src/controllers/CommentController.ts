import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { config } from '../config';

export class CommentController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { content, author, parentId } = req.body;

      const countDoc = await Comment.countDocuments({ parentId });

      if (parentId && countDoc >= config.commentDepth) {
        res.status(400).json({ error: `Maximum nesting depth of ${config.commentDepth} exceeded` });
        return;
      }

      const comment = new Comment({ content, author, parentId });
      await comment.save();
      res.status(201).json(comment);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to create comment', details: (error as Error).message });
    }
  }

  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { parentId, limit = '3', offset = '0' } = req.query;
      const comments = await Comment.find({ parentId })
        .skip(Number(offset))
        .limit(Number(limit));

      // Filter out flagged comments (more than 5 flags)
      const visibleComments = comments.filter(comment => comment.flags < 5);
      res.json(visibleComments);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to retrieve comments', details: (error as Error).message });
    }
  }

  async flagComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comment = await Comment.findById(id);

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

      await comment.save();
      res.json(comment);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to flag comment', details: (error as Error).message });
    }
  }

  async likeComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId; // Assume userId comes from the request body

      const comment = await Comment.findById(id);

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
      await comment.adjustLikes(1);
      comment.likedBy.push(userId);

      await comment.save();
      res.json(comment);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to like comment', details: (error as Error).message });
    }
  }

  async unlikeComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId; // Assume userId comes from the request body

      const comment = await Comment.findById(id);

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
      await comment.adjustLikes(-1);
      comment.likedBy.splice(userIndex, 1);

      await comment.save();
      res.json(comment);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to unlike comment', details: (error as Error).message });
    }
  }

  async dislikeComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId; // Assume userId comes from the request body

      const comment = await Comment.findById(id);

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
      await comment.adjustLikes(-1); // Decrease likes count
      comment.disLikedBy.push(userId);

      await comment.save();
      res.json(comment);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to dislike comment', details: (error as Error).message });
    }
  }

  async undislikeComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId; // Assume userId comes from the request body

      const comment = await Comment.findById(id);

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
      await comment.adjustLikes(1); // Increase likes count
      comment.disLikedBy.splice(userIndex, 1);

      await comment.save();
      res.json(comment);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to undislike comment', details: (error as Error).message });
    }
  }

  async editComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const comment = await Comment.findById(id);
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      comment.content = content;
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to edit comment', details: (error as Error).message });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Find the comment to delete
      const comment = await Comment.findById(id);
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      // Delete all child comments
      await Comment.deleteMany({ parentId: id });

      // Delete the comment itself
      await Comment.findByIdAndDelete(id);

      res.status(204).send(); // No content to send back
    } catch (error: unknown) {
      res.status(500).json({ error: 'Failed to delete comment', details: (error as Error).message });
    }
  }

}

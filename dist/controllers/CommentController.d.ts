import { Request, Response } from 'express';
export declare class CommentController {
    create(req: Request, res: Response): Promise<void>;
    getComments(req: Request, res: Response): Promise<void>;
    flagComment(req: Request, res: Response): Promise<void>;
    likeComment(req: Request, res: Response): Promise<void>;
    unlikeComment(req: Request, res: Response): Promise<void>;
    dislikeComment(req: Request, res: Response): Promise<void>;
    undislikeComment(req: Request, res: Response): Promise<void>;
    editComment(req: Request, res: Response): Promise<void>;
    deleteComment(req: Request, res: Response): Promise<void>;
}

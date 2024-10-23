import mongoose, { Document } from 'mongoose';
export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    parentId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    flags: number;
    likes: number;
    likedBy: mongoose.Types.ObjectId[];
    disLikedBy: mongoose.Types.ObjectId[];
    isHidden: boolean;
    adjustLikes(amount: number): Promise<IComment>;
}
export declare const Comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment> & IComment & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>;

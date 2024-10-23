import mongoose, { Schema, Document } from 'mongoose';

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
  adjustLikes(amount: number): Promise<IComment>; // Method signature
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type:  mongoose.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  flags: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Add this line
  disLikedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Add this line
  isHidden: { type: Boolean, default:false }
});


CommentSchema.methods.adjustLikes = function(amount: number) {
  this.likes += amount;
  return this.save();
};



export const Comment = mongoose.model<IComment>('Comment', CommentSchema);


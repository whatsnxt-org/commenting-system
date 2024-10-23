"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CommentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    author: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    flags: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }], // Add this line
    disLikedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }], // Add this line
    isHidden: { type: Boolean, default: false }
});
CommentSchema.methods.adjustLikes = function (amount) {
    this.likes += amount;
    return this.save();
};
exports.Comment = mongoose_1.default.model('Comment', CommentSchema);

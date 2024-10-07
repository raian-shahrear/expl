import { model, Schema } from 'mongoose';
import { TComment } from './comments.interface';

const commentSchema = new Schema<TComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const CommentModel = model<TComment>('Comment', commentSchema);

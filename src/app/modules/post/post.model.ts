import { model, Schema } from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    travelStory: {
      type: String,
      required: true,
    },
    upvote: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    downvote: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    premium: {
      travelGuide: {
        type: String,
      },
      destinationTips: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

export const PostModel = model<TPost>('Post', postSchema);

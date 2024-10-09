import { Types } from 'mongoose';

export type TPost = {
  title: string;
  image: string[];
  category: Types.ObjectId;
  author: Types.ObjectId;
  travelStory: string;
  upvote?: Types.ObjectId[];
  downvote?: Types.ObjectId[];
  premium?: {
    travelGuide?: string;
    destinationTips?: string;
  };
};

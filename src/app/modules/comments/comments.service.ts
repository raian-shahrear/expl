import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../users/users.model';
import { TComment } from './comments.interface';
import { CommentModel } from './comments.model';

// create a comment
const createCommentIntoB = async (
  user: Record<string, unknown>,
  payload: TComment,
) => {
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (!loggedInUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  //   const isPostExist = await PostModel.findById(payload?.post);
  //   if (!isPostExist) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'This post is not found!');
  //   }

  payload.user = loggedInUser?._id;
  const result = await CommentModel.create(payload);
  return result;
};

// get all comments by post
const getAllCommentsFromDB = async (postId: string) => {
  const result = await CommentModel.find({ post: postId });
  return result;
};

// update comment
const updateCommentIntoDB = async (id: string, payload: Partial<TComment>) => {
  const isCommentExist = await CommentModel.findById(id);
  if (!isCommentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This comment is not found!');
  }

  const result = await CommentModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// delete comment
const deleteCommentFromDB = async (id: string) => {
  const isCommentExist = await CommentModel.findById(id);
  if (!isCommentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This comment is not found!');
  }

  const result = await CommentModel.findByIdAndDelete(id);
  return result;
};

export const CommentServices = {
  createCommentIntoB,
  getAllCommentsFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
};

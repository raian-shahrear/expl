import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../users/users.model';
import { TPost } from './post.interface';
import { PostModel } from './post.model';
import mongoose from 'mongoose';
import { CommentModel } from '../comments/comments.model';
import QueryBuilder from '../../builder/QueryBuilder';

// create a post
const createPostIntoB = async (
  user: Record<string, unknown>,
  payload: TPost,
) => {
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (!loggedInUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }

  payload.author = loggedInUser?._id;
  const result = await PostModel.create(payload);
  return result;
};

// get all post
const getAllPostFromDB = async (query: Record<string, unknown>) => {
  const getQuery = new QueryBuilder(
    PostModel.find()
      .populate({ path: 'category' })
      .populate({ path: 'author' }),
    query,
  )
    .sort()
    .search(['title', 'travelStory'])
    .filter()
    .paginate();
  const result = await getQuery.queryModel;
  const meta = await getQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get all post by userId
const getAllPostByUserFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const getQuery = new QueryBuilder(
    PostModel.find({ author: userId })
      .populate({ path: 'category' })
      .populate({ path: 'author' }),
    query,
  )
    .sort()
    .paginate();
  const result = await getQuery.queryModel;
  const meta = await getQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get single post
const getSinglePostFromDB = async (id: string) => {
  const result = await PostModel.findById(id);
  return result;
};

// update post
const updatePostIntoDB = async (
  id: string,
  payload: Partial<TPost>,
  user: Record<string, unknown>,
) => {
  const isPostExist = await PostModel.findById(id);
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post is not found!');
  }
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (loggedInUser?._id.toString() !== isPostExist?.author.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }

  const result = await PostModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// delete post
const deletePostFromDB = async (id: string, user: Record<string, unknown>) => {
  const isPostExist = await PostModel.findById(id);
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post is not found!');
  }
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (loggedInUser?._id.toString() !== isPostExist?.author.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }
  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    // delete post
    const deletePost = await PostModel.findByIdAndDelete(id, { session });
    if (!deletePost) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete post!');
    }

    const commentsExist = await CommentModel.exists({ post: id });
    if (commentsExist) {
      // If comments exist, delete them
      const deleteComments = await CommentModel.deleteMany(
        { post: id },
        { session },
      );
      if (!deleteComments) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to delete comments!',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();
    return null;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

// upvote post
const upvotePostIntoDB = async (id: string, user: Record<string, unknown>) => {
  const isPostExist = await PostModel.findById(id);
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post is not found!');
  }
  // is user exist
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (!loggedInUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }
  const userId = loggedInUser._id;

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();

    // Check if user has already upvoted the post
    const hasUpvoted = isPostExist?.upvote?.includes(userId);
    let updatePost;
    if (!hasUpvoted) {
      // Add user to upvote array
      updatePost = await PostModel.findByIdAndUpdate(
        id,
        { $push: { upvote: userId } },
        { new: true, session },
      );

      // Remove user from downvote array
      if (isPostExist?.downvote?.includes(userId)) {
        await PostModel.findByIdAndUpdate(
          id,
          { $pull: { downvote: userId } },
          { new: true, session },
        );
      }
    } else {
      updatePost = await PostModel.findByIdAndUpdate(
        id,
        { $pull: { upvote: userId } },
        { new: true, session },
      );
    }

    // update user verification status
    const postAuthor = await UserModel.findById(isPostExist?.author);
    if (updatePost && postAuthor) {
      if (updatePost!.upvote!.length > 0 && postAuthor.isVerified === 'no') {
        await UserModel.findByIdAndUpdate(
          postAuthor._id,
          { isVerified: 'pending' },
          { new: true, session },
        );
      } else if (
        postAuthor.isVerified === 'pending' &&
        updatePost!.upvote!.length === 0
      ) {
        await UserModel.findByIdAndUpdate(
          postAuthor._id,
          { isVerified: 'no' },
          { new: true, session },
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();
    return updatePost;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

// downvote post
const downvotePostIntoDB = async (
  id: string,
  user: Record<string, unknown>,
) => {
  const isPostExist = await PostModel.findById(id);
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post is not found!');
  }
  // is user exist
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (!loggedInUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }
  const userId = loggedInUser._id;

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();

    // Check if user has already downvoted the post
    const hasDownvoted = isPostExist?.downvote?.includes(userId);
    let updatePost;
    if (!hasDownvoted) {
      // Add user to downvote array
      await PostModel.findByIdAndUpdate(
        id,
        { $push: { downvote: userId } },
        { new: true, session },
      );

      // Remove user from upvote array
      if (isPostExist?.upvote?.includes(userId)) {
        updatePost = await PostModel.findByIdAndUpdate(
          id,
          { $pull: { upvote: userId } },
          { new: true, session },
        );
      }
    } else {
      await PostModel.findByIdAndUpdate(
        id,
        { $pull: { downvote: userId } },
        { new: true, session },
      );
    }

    // update user verification status
    const postAuthor = await UserModel.findById(isPostExist?.author);
    if (updatePost && postAuthor) {
      if (
        postAuthor.isVerified === 'pending' &&
        updatePost!.upvote!.length === 0
      ) {
        await UserModel.findByIdAndUpdate(
          postAuthor._id,
          { isVerified: 'no' },
          { new: true, session },
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();
    return updatePost;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

export const PostServices = {
  createPostIntoB,
  getAllPostFromDB,
  getAllPostByUserFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  upvotePostIntoDB,
  downvotePostIntoDB,
};

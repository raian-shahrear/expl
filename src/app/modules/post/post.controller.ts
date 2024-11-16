/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

// create a post
const createPost = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntoB(req.user, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post is created successfully!',
    data: result,
  });
});

// get all post
const getAllPost = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostFromDB(req.query);

  // send response
  res
    .status(result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND)
    .json({
      success: result?.result?.length ? true : false,
      statusCode: result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND,
      message: result?.result?.length
        ? 'Post are retrieved successfully!'
        : 'No Data Found!',
      data: result?.result,
      meta: result?.meta,
    });
});

// get all post by user
const getAllPostByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await PostServices.getAllPostByUserFromDB(userId, req.query);

  // send response
  res
    .status(result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND)
    .json({
      success: result?.result?.length ? true : false,
      statusCode: result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND,
      message: result?.result?.length
        ? 'Post are retrieved successfully!'
        : 'No Data Found!',
      data: result?.result,
      meta: result?.meta,
    });
});

// get single post
const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.getSinglePostFromDB(id);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post is retrieved successfully!',
    data: result,
  });
});

// update post
const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.updatePostIntoDB(id, req.body, req.user);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post is updated successfully!',
    data: result,
  });
});

// delete post
const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.deletePostFromDB(id);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post is deleted successfully!',
    data: result,
  });
});

// upvote post
const upvotePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.upvotePostIntoDB(id, req.user);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Upvoted successfully!',
    data: result,
  });
});

// downvote post
const downvotePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.downvotePostIntoDB(id, req.user);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Downvoted successfully!',
    data: result,
  });
});

export const PostControllers = {
  createPost,
  getAllPost,
  getAllPostByUser,
  getSinglePost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
};

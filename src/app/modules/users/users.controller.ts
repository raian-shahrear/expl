import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './users.service';
import config from '../../config';

// register user
const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserIntoDB(req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is registered successfully!',
    data: result,
  });
});

// login user
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);

  // set refresh token to the cookie
  const { refreshToken, accessToken } = result.token;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  // send response
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully!',
    data: { accessToken, refreshToken },
  });
});

// update user
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserIntoDB(id, req.user, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is updated successfully!',
    data: result,
  });
});

// update user's cover
const updateUserCover = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserCoverIntoDB(
    id,
    req.user,
    req.body,
  );

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User's cover is updated successfully!",
    data: result,
  });
});

// update user email
const updateUserEmail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserEmailIntoDB(id, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User email is updated successfully!',
    data: result,
  });
});

// update user role
const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserRoleIntoDB(id, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User role is updated successfully!',
    data: result,
  });
});

// get all user
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  // send response
  res
    .status(result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND)
    .json({
      success: result?.result?.length ? true : false,
      statusCode: result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND,
      message: result?.result?.length
        ? 'Users are retrieved successfully!'
        : 'No Data Found!',
      data: result?.result,
      meta: result?.meta,
    });
});

// get all users name
const getAllUsersName = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersNameFromDB();

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User name retrieved successfully!',
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserServices.changePasswordIntoDB(user, req.body);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password is changed successfully!',
    data: result,
  });
});

// get accessToken from refreshToken
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.refreshToken(refreshToken);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

// follow user
const followUser = catchAsync(async (req, res) => {
  const result = await UserServices.followUserIntoDB(req.user, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User followed successfully!',
    data: result,
  });
});

// unfollow user
const unfollowUser = catchAsync(async (req, res) => {
  const result = await UserServices.unfollowUserIntoDB(req.user, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User followed successfully!',
    data: result,
  });
});

// verify User
const verifyUser = catchAsync(async (req, res) => {
  const result = await UserServices.verifyUserIntoDB(req.user);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Request accepted, proceed to payment!',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  updateUser,
  updateUserRole,
  loginUser,
  getAllUsers,
  getAllUsersName,
  changePassword,
  refreshToken,
  followUser,
  unfollowUser,
  updateUserEmail,
  verifyUser,
  updateUserCover,
};

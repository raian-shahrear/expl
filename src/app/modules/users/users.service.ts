import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TLoginUser, TUser } from './users.interface';
import { UserModel } from './users.model';
import bcrypt from 'bcrypt';
import { crateToken } from './users.util';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

// register user
const registerUserIntoDB = async (payload: TUser) => {
  const isUserExist = await UserModel.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, 'User is already registered!');
  }

  const result = await UserModel.create(payload);
  const newUser = await UserModel.findById(result._id).select(['-password']);
  return newUser;
};

// login user
const loginUser = async (payload: TLoginUser) => {
  // checking user existed or not
  const isUserExist = await UserModel.findOne({ email: payload.email }).select([
    '+password',
  ]);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  // checking password matched or not
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExist.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not matched!');
  }

  // create access_token and sent to the user
  const jwtPayload = {
    id: isUserExist._id,
    userEmail: isUserExist.email,
    userName: isUserExist.name,
    role: isUserExist.role,
    userProfile: isUserExist.profile,
    userPhone: isUserExist.phone,
    userAddress: isUserExist.address,
    following: isUserExist.following,
    follower: isUserExist.follower,
    isVerified: isUserExist.isVerified,
  };
  const accessToken = crateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );
  // create refresh_token and sent to a client
  const refreshToken = crateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire_in as string,
  );

  //   const loggedInUser = await UserModel.findOne({ email: payload.email });

  return {
    token: { accessToken, refreshToken },
    // data: loggedInUser,
  };
};

// update user
const updateUserIntoDB = async (
  id: string,
  user: Record<string, unknown>,
  payload: Partial<TUser>,
) => {
  // checking logged in user
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (loggedInUser?._id.toString() !== id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }

  // checking the id exist or not
  const isUserExist = await UserModel.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist!');
  }

  const result = await UserModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// update user role
const updateUserRoleIntoDB = async (id: string, payload: Partial<TUser>) => {
  // checking the id exist or not
  const isUserExist = await UserModel.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist!');
  }

  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// get all user
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const getQuery = new QueryBuilder(
    UserModel.find()
      .populate({ path: 'following.user' })
      .populate({ path: 'follower.user' }),
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

// change password
const changePasswordIntoDB = async (
  user: Record<string, unknown>,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking user is exist or not by userId
  const loggedInUser = await UserModel.findOne({
    email: user.userEmail,
  }).select('+password');
  if (!loggedInUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }
  // checking password matched or not
  const isPasswordMatched = await bcrypt.compare(
    payload?.oldPassword,
    loggedInUser.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not matched!');
  }

  // hash newPassword
  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    {
      email: user.userEmail,
      role: user.role,
    },
    {
      password: hashedNewPassword,
      needPassChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

// get accessToken from refreshToken
const refreshToken = async (token: string) => {
  // chucking a token sent from the client or not
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not an authorized user!',
    );
  }

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { userEmail, iat } = decoded;

  // checking user is exist or not by userId
  const existedUser = await UserModel.findOne({ email: userEmail });
  if (!existedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  // checking token issuedAt before passwordChanged (if passwordChanged is bigger than issuedAt)
  if (existedUser?.passwordChangedAt && iat) {
    const passwordChangedAt =
      new Date(existedUser?.passwordChangedAt).getTime() / 1000;
    if (passwordChangedAt > iat) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are unauthorized! Please login again!',
      );
    }
  }

  // create access_token and sent to a client
  const jwtPayload = {
    id: existedUser._id,
    userEmail: existedUser.email,
    userName: existedUser.name,
    role: existedUser.role,
    userProfile: existedUser.profile,
    userPhone: existedUser.phone,
    userAddress: existedUser.address,
    needPassChange: existedUser.needPassChange,
  };
  const accessToken = crateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  return { accessToken };
};

// follow user
const followUserIntoDB = async (
  user: Record<string, unknown>,
  payload: {
    followingUserId: string;
  },
) => {
  // is user exist
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (!loggedInUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }
  const followingUser = await UserModel.findById(payload?.followingUserId);
  if (!followingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist!');
  }
  // Check if already following
  const isAlreadyFollowing = loggedInUser.following?.some(
    (follow) => follow.user.toString() === payload?.followingUserId,
  );
  if (isAlreadyFollowing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are already following this user!',
    );
  }

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    const myProfileUpdate = await UserModel.findByIdAndUpdate(
      loggedInUser._id,
      { $push: { following: { user: payload?.followingUserId } } },
      { new: true, session },
    );
    if (!myProfileUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update following!');
    }

    const myFollowingProfileUpdate = await UserModel.findByIdAndUpdate(
      payload?.followingUserId,
      { $push: { follower: { user: loggedInUser._id.toString() } } },
      { new: true, session },
    );
    if (!myFollowingProfileUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update following!');
    }

    await session.commitTransaction();
    await session.endSession();
    return myProfileUpdate;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

// unfollow user
const unfollowUserIntoDB = async (
  user: Record<string, unknown>,
  payload: {
    followingUserId: string;
  },
) => {
  // is user exist
  const loggedInUser = await UserModel.findOne({ email: user.userEmail });
  if (!loggedInUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized user!');
  }
  const followingUser = await UserModel.findById(payload?.followingUserId);
  if (!followingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist!');
  }
  // Check if already following
  const isAlreadyFollowing = loggedInUser.following?.some(
    (follow) => follow.user.toString() === payload?.followingUserId,
  );
  if (!isAlreadyFollowing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are not following this user yet!',
    );
  }

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    const myProfileUpdate = await UserModel.findByIdAndUpdate(
      loggedInUser._id,
      { $pull: { following: { user: payload?.followingUserId } } },
      { new: true, session },
    );
    if (!myProfileUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update following!');
    }

    const myFollowingProfileUpdate = await UserModel.findByIdAndUpdate(
      payload?.followingUserId,
      { $pull: { follower: { user: loggedInUser._id.toString() } } },
      { new: true, session },
    );
    if (!myFollowingProfileUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update following!');
    }

    await session.commitTransaction();
    await session.endSession();
    return myProfileUpdate;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

export const UserServices = {
  registerUserIntoDB,
  updateUserIntoDB,
  updateUserRoleIntoDB,
  loginUser,
  getAllUsersFromDB,
  changePasswordIntoDB,
  refreshToken,
  followUserIntoDB,
  unfollowUserIntoDB,
};

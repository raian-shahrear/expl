import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import { UserModel } from '../modules/users/users.model';
import { verifyToken } from '../utils/verifyJWT';

type TUserRole = 'admin' | 'user';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // chucking a token sent from the client or not
    if (!token) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not an authorized user!',
      );
    }
    // chucking a token is valid or not
    if (token && !token.startsWith('Bearer ')) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not an authorized user!',
      );
    }
    // decode the token
    if (token && token.startsWith('Bearer ')) {
      const jwtToken = token.split(' ')[1];

      const decoded = verifyToken(
        jwtToken,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const { role, userEmail } = decoded;

      // checking the token is valid or not
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You have no access to this route!',
        );
      }
      // checking user is exist or not
      const existedUser = await UserModel.findOne({ email: userEmail });
      if (!existedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
      }

      // add the decoded data as user to the req
      req.user = decoded as JwtPayload;
    }

    next();
  });
};

export default auth;

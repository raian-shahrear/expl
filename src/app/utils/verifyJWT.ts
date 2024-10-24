/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    throw new AppError(httpStatus.UNAUTHORIZED, `${error}`);
  }
};

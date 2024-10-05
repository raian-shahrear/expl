import jwt from 'jsonwebtoken';

export const crateToken = (
  jwtPayload: { userEmail: string; role: string },
  secret: string,
  expireIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expireIn,
  });
};

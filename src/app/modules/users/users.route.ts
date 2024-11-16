import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './users.validation';
import { UserControllers } from './users.controller';
import auth from '../../middlewares/user.auth';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/signup',
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...JSON.parse(req?.body?.data),
      profile: req?.file?.path,
    };
    next();
  },
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.registerUser,
);

router.post(
  '/login',
  validateRequest(UserValidation.loginValidationSchema),
  UserControllers.loginUser,
);

router.patch(
  '/users/:id',
  auth('admin', 'user'),
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...JSON.parse(req?.body?.data),
      profile: req?.file?.path,
    };
    next();
  },
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser,
);

router.patch(
  '/user-email/:id',
  auth('admin', 'user'),
  validateRequest(UserValidation.updateUserEmailValidationSchema),
  UserControllers.updateUserEmail,
);

router.patch(
  '/user-role/:id',
  auth('admin'),
  validateRequest(UserValidation.updateUserRoleValidationSchema),
  UserControllers.updateUserRole,
);

router.get('/users', auth('admin', 'user'), UserControllers.getAllUsers);
router.get('/users-name', UserControllers.getAllUsersName);
router.post(
  '/change-password',
  auth('admin', 'user'),
  validateRequest(UserValidation.changePasswordValidationSchema),
  UserControllers.changePassword,
);
router.post(
  '/refresh-token',
  validateRequest(UserValidation.refreshTokenValidationSchema),
  UserControllers.refreshToken,
);
router.patch(
  '/follow',
  auth('user'),
  validateRequest(UserValidation.updateFollowValidationSchema),
  UserControllers.followUser,
);
router.patch(
  '/unfollow',
  auth('user'),
  validateRequest(UserValidation.updateFollowValidationSchema),
  UserControllers.unfollowUser,
);

router.patch('/user-verify', auth('user'), UserControllers.verifyUser);

export const UserRoutes = router;

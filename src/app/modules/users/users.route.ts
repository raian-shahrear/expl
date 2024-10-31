import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './users.validation';
import { UserControllers } from './users.controller';
import auth from '../../middlewares/user.auth';

const router = express.Router();

router.post(
  '/signup',
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
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser,
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

export const UserRoutes = router;

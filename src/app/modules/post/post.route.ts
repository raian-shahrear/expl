/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/user.auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidation } from './post.validation';
import { PostControllers } from './post.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  multerUpload.fields([{ name: 'images' }]),
  (req: Request, res: Response, next: NextFunction) => {
    const files = req?.files as { [fieldname: string]: Express.Multer.File[] };
    req.body = {
      ...JSON.parse(req?.body?.data),
      image: files?.images?.map((file: any) => file?.path),
    };
    next();
  },
  validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost,
);

router.get('/', PostControllers.getAllPost);
router.get('/:id', PostControllers.getSinglePost);
router.get(
  '/byUser/:userId',
  auth('admin', 'user'),
  PostControllers.getAllPostByUser,
);
router.patch(
  '/:id',
  auth('user'),
  multerUpload.fields([{ name: 'images' }]),
  (req: Request, res: Response, next: NextFunction) => {
    const files = req?.files as { [fieldname: string]: Express.Multer.File[] };
    const data = JSON.parse(req?.body?.data);
    req.body = {
      ...data,
      image: [...data.image, ...(files?.images?.map((file: any) => file?.path) || [])],
    };
    next();
  },
  validateRequest(PostValidation.updatePostValidationSchema),
  PostControllers.updatePost,
);

router.delete('/:id', auth('admin', 'user'), PostControllers.deletePost);
router.patch('/upvote/:id', auth('user'), PostControllers.upvotePost);
router.patch('/downvote/:id', auth('user'), PostControllers.downvotePost);

export const PostRoutes = router;

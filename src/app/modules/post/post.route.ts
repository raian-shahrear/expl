import express from 'express';
import auth from '../../middlewares/user.auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidation } from './post.validation';
import { PostControllers } from './post.controller';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost,
);
router.get('/', auth('admin','user'), PostControllers.getAllPost);
router.get('/:userId', auth('admin','user'), PostControllers.getAllPostByUser);
router.patch(
  '/:id',
  auth('user'),
  validateRequest(PostValidation.updatePostValidationSchema),
  PostControllers.updatePost,
);
router.delete('/:id', auth('admin', 'user'), PostControllers.deletePost);
router.patch('/upvote/:id', auth('user'), PostControllers.upvotePost);
router.patch('/downvote/:id', auth('user'), PostControllers.downvotePost);

export const PostRoutes = router;

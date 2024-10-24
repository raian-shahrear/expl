import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidation } from './comments.validation';
import { CommentControllers } from './comments.controller';
import auth from '../../middlewares/user.auth';


const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(CommentValidation.createCommentValidationSchema),
  CommentControllers.createComment,
);
router.get('/:postId', CommentControllers.getAllComments);
router.patch(
  '/:id',
  auth('user'),
  validateRequest(CommentValidation.updateCommentValidationSchema),
  CommentControllers.updateComment,
);
router.delete(
  '/:id',
  auth('admin', 'user'),
  CommentControllers.deleteComment,
);

export const CommentRoutes = router;
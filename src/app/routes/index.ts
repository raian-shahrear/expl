import express from 'express';
import { UserRoutes } from '../modules/users/users.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { CommentRoutes } from '../modules/comments/comments.route';
import { PostRoutes } from '../modules/post/post.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { EventRoutes } from '../modules/events/events.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/post',
    route: PostRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/events',
    route: EventRoutes,
  },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;

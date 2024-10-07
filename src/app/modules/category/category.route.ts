import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import { CategoryControllers } from './category.controller';
import auth from '../../middlewares/user.auth';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCategories);
router.patch(
  '/:id',
  auth('admin'),
  validateRequest(CategoryValidations.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

export const CategoryRoutes = router;

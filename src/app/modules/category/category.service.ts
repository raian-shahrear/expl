import httpStatus from 'http-status';
import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';
import AppError from '../../errors/AppError';

// create a category
const createCategoryIntoDB = async (payload: TCategory) => {
  const result = await CategoryModel.create(payload);
  return result;
};

// get all category
const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find();
  return result;
};

// update a category
const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategory>,
) => {
  const isCategoryExist = await CategoryModel.findById(id);
  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This category is not found!');
  }

  const result = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const CategoryServices = {
  getAllCategoriesFromDB,
  createCategoryIntoDB,
  updateCategoryIntoDB,
};

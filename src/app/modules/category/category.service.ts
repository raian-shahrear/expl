import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';

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

export const CategoryServices = {
  getAllCategoriesFromDB,
  createCategoryIntoDB,
};

import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import Category, { ICategory } from '../models/Category';

/* Category */
export async function getCategorys(
  filter: FilterQuery<ICategory> = {},
  options: FilterOptions<ICategory> = {}
) {
  let query = Category.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getCategory(
  filter: FilterQuery<ICategory> = {},
  options: FilterOptions<ICategory> = {}
) {
  let query = Category.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createCategory(data: CreateInput<ICategory>) {
  let category = await Category.create(data);
  return getCategory({ _id: category._id });
}

export function updateCategory(filter: FilterQuery<ICategory>, data: UpdateInput<ICategory>) {
  return Category.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteCategorys(filter: FilterQuery<ICategory>) {
  let categorys = await getCategorys(filter);

  await Category.deleteMany(filter);

  return categorys;
}

export async function deleteCategory(filter: FilterQuery<ICategory>) {
  let category = await getCategory(filter);

  if (category) await Category.deleteOne({ _id: category._id });

  return category;
}

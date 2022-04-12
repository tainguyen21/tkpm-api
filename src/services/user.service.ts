import { processFilterOptions } from './../common/functions';
import { FilterOptions, CreateInput, UpdateInput } from './../common/interfaces';
import { FilterQuery } from 'mongoose';
import User, { IUser } from '../models/User';

export async function getUsers(
  filter: FilterQuery<IUser> = {},
  options: FilterOptions<IUser> = {}
) {
  let query = User.find(filter);

  (options as FilterOptions<IUser>).select = '-password';

  query = processFilterOptions(query, options);

  return query.lean();
}

export async function getUser(
  filter: FilterQuery<IUser> = {},
  options: FilterOptions<IUser> = {},
  includePassword: boolean = false
) {
  let query = User.findOne(filter);

  if (!includePassword) (options as FilterOptions<IUser>).select = '-password';

  query = processFilterOptions(query, options);

  return query.lean();
}

export async function createUser(data: CreateInput<IUser>) {
  const user = await User.create(data);

  return getUser({ _id: user._id });
}

export function updateUser(filter: FilterQuery<IUser>, data: UpdateInput<IUser>) {
  return User.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteUsers(filter: FilterQuery<IUser>) {
  let users = await getUsers(filter);

  await User.deleteMany(filter);

  return users;
}

export async function deleteUser(filter: FilterQuery<IUser>) {
  let user = await getUser(filter);

  if (user) await User.deleteOne({ _id: user._id });

  return user;
}

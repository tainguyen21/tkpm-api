import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import Language, { ILanguage } from '../models/Language';

/* Language */
export async function getLanguages(
  filter: FilterQuery<ILanguage> = {},
  options: FilterOptions<ILanguage> = {}
) {
  let query = Language.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getLanguage(
  filter: FilterQuery<ILanguage> = {},
  options: FilterOptions<ILanguage> = {}
) {
  let query = Language.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createLanguage(data: CreateInput<ILanguage>) {
  let language = await Language.create(data);
  return getLanguage({ _id: language._id });
}

export function updateLanguage(filter: FilterQuery<ILanguage>, data: UpdateInput<ILanguage>) {
  return Language.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteLanguages(filter: FilterQuery<ILanguage>) {
  let languages = await getLanguages(filter);

  await Language.deleteMany(filter);

  return languages;
}

export async function deleteLanguage(filter: FilterQuery<ILanguage>) {
  let language = await getLanguage(filter);

  if (language) await Language.deleteOne({ _id: language._id });

  return language;
}

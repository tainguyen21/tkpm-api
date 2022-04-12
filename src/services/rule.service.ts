import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import Rule, { IRule } from '../models/Rule';

/* Rule */
export async function getRules(
  filter: FilterQuery<IRule> = {},
  options: FilterOptions<IRule> = {}
) {
  let query = Rule.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getRule(filter: FilterQuery<IRule> = {}, options: FilterOptions<IRule> = {}) {
  let query = Rule.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createRule(data: CreateInput<IRule>) {
  let rule = await Rule.create(data);
  return getRule({ _id: rule._id });
}

export function updateRule(filter: FilterQuery<IRule>, data: UpdateInput<IRule>) {
  return Rule.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteRules(filter: FilterQuery<IRule>) {
  let Rules = await getRules(filter);

  await Rule.deleteMany(filter);

  return Rules;
}

export async function deleteRule(filter: FilterQuery<IRule>) {
  let rule = await getRule(filter);

  if (rule) await Rule.deleteOne({ _id: rule._id });

  return rule;
}

import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import Publisher, { IPublisher } from '../models/Publisher';

/* Publisher */
export async function getPublishers(
  filter: FilterQuery<IPublisher> = {},
  options: FilterOptions<IPublisher> = {}
) {
  let query = Publisher.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getPublisher(
  filter: FilterQuery<IPublisher> = {},
  options: FilterOptions<IPublisher> = {}
) {
  let query = Publisher.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createPublisher(data: CreateInput<IPublisher>) {
  let publisher = await Publisher.create(data);
  return getPublisher({ _id: publisher._id });
}

export function updatePublisher(filter: FilterQuery<IPublisher>, data: UpdateInput<IPublisher>) {
  return Publisher.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deletePublishers(filter: FilterQuery<IPublisher>) {
  let Publishers = await getPublishers(filter);

  await Publisher.deleteMany(filter);

  return Publishers;
}

export async function deletePublisher(filter: FilterQuery<IPublisher>) {
  let publisher = await getPublisher(filter);

  if (publisher) await Publisher.deleteOne({ _id: publisher._id });

  return publisher;
}

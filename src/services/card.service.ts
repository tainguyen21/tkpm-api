import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import Card, { ICard } from '../models/Card';

/* Card */
export async function getCards(
  filter: FilterQuery<ICard> = {},
  options: FilterOptions<ICard> = {}
) {
  let query = Card.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getCard(filter: FilterQuery<ICard> = {}, options: FilterOptions<ICard> = {}) {
  let query = Card.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createCard(data: CreateInput<ICard>) {
  let card = await Card.create(data);
  return getCard({ _id: card._id });
}

export function updateCard(filter: FilterQuery<ICard>, data: UpdateInput<ICard>) {
  return Card.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteCards(filter: FilterQuery<ICard>) {
  let Cards = await getCards(filter);

  await Card.deleteMany(filter);

  return Cards;
}

export async function deleteCard(filter: FilterQuery<ICard>) {
  let card = await getCard(filter);

  if (card) await Card.deleteOne({ _id: card._id });

  return card;
}

import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import Book, { IBook } from '../models/Book';

/* Book */
export async function getBooks(
  filter: FilterQuery<IBook> = {},
  options: FilterOptions<IBook> = {}
) {
  let query = Book.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getBook(filter: FilterQuery<IBook> = {}, options: FilterOptions<IBook> = {}) {
  let query = Book.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createBook(data: CreateInput<IBook>) {
  let book = await Book.create(data);
  return getBook({ _id: book._id });
}

export function updateBook(filter: FilterQuery<IBook>, data: UpdateInput<IBook>) {
  return Book.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteBooks(filter: FilterQuery<IBook>) {
  let Books = await getBooks(filter);

  await Book.deleteMany(filter);

  return Books;
}

export async function deleteBook(filter: FilterQuery<IBook>) {
  let book = await getBook(filter);

  if (book) await Book.deleteOne({ _id: book._id });

  return book;
}

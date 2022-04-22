import Book from '../models/Book';
import User from '../models/User';

/* Book */
export async function getStatisticBooks(limit: number = 10, sort: 1 | -1 = 1) {
  return Book.aggregate([
    {
      $lookup: {
        from: 'orderdetails',
        localField: '_id',
        foreignField: 'book',
        as: 'details',
      },
    },
    {
      $addFields: {
        total: {
          $size: '$details',
        },
      },
    },
    {
      $sort: {
        total: sort,
      },
    },
    {
      $limit: limit,
    },
  ]);
}
export async function getStatisticUsers(limit: number = 10, sort: 1 | -1 = 1) {
  return User.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'user',
        as: 'orders',
      },
    },
    {
      $lookup: {
        from: 'orderdetails',
        localField: 'orders._id',
        foreignField: 'order',
        as: 'orderDetails',
      },
    },
    {
      $addFields: {
        total: {
          $size: '$orderDetails',
        },
      },
    },
    {
      $sort: {
        total: sort,
      },
    },
    {
      $limit: limit,
    },
  ]);
}

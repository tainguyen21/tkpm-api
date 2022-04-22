import Order from '../models/Order';
import OrderDetail from '../models/OrderDetail';

/* Book */
export async function getStatisticBooks(limit: number = 10, sort: 1 | -1 = 1) {
  return OrderDetail.aggregate([
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'book',
      },
    },
    {
      $match: {
        book: {
          $exists: true,
          $ne: [],
        },
      },
    },
    {
      $group: {
        _id: '$book',
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: sort,
      },
    },
    {
      $limit: limit,
    },
  ]);
}
export async function getStatisticUsers(limit: number = 10, sort: 1 | -1 = 1) {
  return Order.aggregate([
    {
      $lookup: {
        from: 'orderdetails',
        localField: '_id',
        foreignField: 'order',
        as: 'orderItems',
      },
    },
    {
      $addFields: {
        total: {
          $size: '$orderItems',
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

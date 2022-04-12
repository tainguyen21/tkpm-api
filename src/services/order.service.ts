import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import Order, { IOrder } from '../models/Order';

/* Order */
export async function getOrders(
  filter: FilterQuery<IOrder> = {},
  options: FilterOptions<IOrder> = {}
) {
  let query = Order.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getOrder(
  filter: FilterQuery<IOrder> = {},
  options: FilterOptions<IOrder> = {}
) {
  let query = Order.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createOrder(data: CreateInput<IOrder>) {
  let order = await Order.create(data);
  return getOrder({ _id: order._id });
}

export function updateOrder(filter: FilterQuery<IOrder>, data: UpdateInput<IOrder>) {
  return Order.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteOrders(filter: FilterQuery<IOrder>) {
  let Orders = await getOrders(filter);

  await Order.deleteMany(filter);

  return Orders;
}

export async function deleteOrder(filter: FilterQuery<IOrder>) {
  let order = await getOrder(filter);

  if (order) await Order.deleteOne({ _id: order._id });

  return order;
}

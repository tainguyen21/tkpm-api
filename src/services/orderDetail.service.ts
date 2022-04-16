import { FilterQuery } from 'mongoose';
import { processFilterOptions } from '../common/functions';
import { CreateInput, FilterOptions, UpdateInput } from '../common/interfaces';
import OrderDetail, { IOrderDetail } from '../models/OrderDetail';

/* OrderDetail */
export async function getOrderDetails(
  filter: FilterQuery<IOrderDetail> = {},
  options: FilterOptions<IOrderDetail> = {}
) {
  let query = OrderDetail.find(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function getOrderDetail(
  filter: FilterQuery<IOrderDetail> = {},
  options: FilterOptions<IOrderDetail> = {}
) {
  let query = OrderDetail.findOne(filter);
  query = processFilterOptions(query, options);
  return query.lean();
}

export async function createOrderDetail(data: CreateInput<IOrderDetail>) {
  let orderDetail = await OrderDetail.create(data);
  return getOrderDetail({ _id: orderDetail._id });
}

export function updateOrderDetail(
  filter: FilterQuery<IOrderDetail>,
  data: UpdateInput<IOrderDetail>
) {
  return OrderDetail.findOneAndUpdate(filter, data, { new: true, lean: true });
}

export async function deleteOrderDetails(filter: FilterQuery<IOrderDetail>) {
  let orderDetails = await getOrderDetails(filter);

  await OrderDetail.deleteMany(filter);

  return orderDetails;
}

export async function deleteOrderDetail(filter: FilterQuery<IOrderDetail>) {
  let orderDetail = await getOrderDetail(filter);

  if (orderDetail) await OrderDetail.deleteOne({ _id: orderDetail._id });

  return OrderDetail;
}

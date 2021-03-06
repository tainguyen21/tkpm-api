import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { moment } from '../../configs/moment';
import { BadRequestResponse, CreatedResponse, ErrorResponse, SuccessResponse } from '../../helpers';
import { IBook } from '../../models/Book';
import { IOrder } from '../../models/Order';
import { getBook, updateBook } from '../../services/book.service';
import { getCard } from '../../services/card.service';
import { createOrder, getOrder, getOrders, updateOrder } from '../../services/order.service';
import {
  createOrderDetail,
  getOrderDetail,
  getOrderDetails,
  updateOrderDetail,
} from '../../services/orderDetail.service';
import { getRule } from '../../services/rule.service';
import { getUser, updateUser } from '../../services/user.service';

const orderController = {
  async get(req: Request, res: Response) {
    try {
      const query: any = {};
      const { user } = req.query;

      if (user) query.user = user;

      const orders = await getOrders(query, { populate: { path: 'user' } });

      for (let order of orders) {
        const details = await getOrderDetails({ order: order._id }, { populate: { path: 'book' } });

        (order as any).details = details;
      }

      return SuccessResponse(res, orders);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async getStatistic(req: Request, res: Response) {
    try {
      const type: any = req.query;

      const start =
        type === 'week' ? moment().startOf('week').toDate() : moment().startOf('month').toDate();
      const end =
        type === 'week' ? moment().endOf('week').toDate() : moment().endOf('month').toDate();

      const orders = await getOrderDetails({
        createdAt: {
          $gt: start,
          $lt: end,
        },
      });

      return SuccessResponse(res, {
        count: orders.length,
      });
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<
      IOrder & {
        books: IBook['_id'];
      }
    >;

    try {
      let rule = await getRule();

      let user = await getUser({ _id: body.user });

      if (user && user.isBlacklist)
        return BadRequestResponse(res, 'Ng?????i d??ng trong danh s??ch ??en');

      let card = await getCard({ user: body.user });

      if (!card) return BadRequestResponse(res, 'Ng?????i d??ng ch??a c?? th???');

      if (moment(card.expiredAt) < moment()) return BadRequestResponse(res, 'Th??? ???? h???t h???n');

      let orders = await getOrders({ user: body.user, status: 'PENDING' });
      let count = 0;

      for (let order of orders) {
        let orderDetail = await getOrderDetails({ order: order._id, status: 'PENDING' });

        count += orderDetail.length;
      }

      if (rule && count + body.books.length > rule.maxBook)
        return BadRequestResponse(res, 'S??? s??ch m?????n v?????t qu?? gi???i h???n');

      if (rule) body.expiredAt = moment().add(rule.maxDate, 'day').toDate();

      let order = await createOrder({
        ...body,
        card: card._id,
      });

      order = await getOrder({ _id: order?._id }, { populate: { path: 'user' } });
      let orderDetails: any[] = [];

      for (let bookId of body.books) {
        let book = await getBook({ _id: bookId });
        if (book?.stock === 0) continue;

        let orderDetail = await createOrderDetail({
          book: bookId,
          order: order?._id,
        });

        await updateBook({ _id: bookId }, { stock: book!.stock - 1 });

        orderDetail = await getOrderDetail(
          { _id: orderDetail?._id },
          {
            populate: {
              path: 'book',
            },
          }
        );

        orderDetails.push(orderDetail);
      }

      (order as any).details = orderDetails;

      if (!order) return ErrorResponse(res, 'T???o kh??ng th??nh c??ng');

      return CreatedResponse(res, order);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<{
      expiredAt: Date;
    }>;

    try {
      let rule = await getRule();

      if (rule && moment(body.expiredAt) > moment().add(rule.maxDate, 'day'))
        return BadRequestResponse(res, 'Ng??y v?????t qu?? gi???i h???n');

      await updateOrder({ _id: id }, body);

      const order = await getOrder({ _id: id }, { populate: { path: 'user' } });

      const details = await getOrderDetails({ order: order!._id }, { populate: { path: 'book' } });

      (order as any).details = details;

      return CreatedResponse(res, order);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async doneDetail(req: Request, res: Response) {
    let { id, detailId } = req.params;

    try {
      let detail = await getOrderDetail({ _id: detailId });
      let order = await getOrder(
        { _id: id },
        {
          populate: {
            path: 'user',
          },
        }
      );

      if (detail && detail.status === 'DONE') return BadRequestResponse(res, 'Phi???u ???? ???????c tr???');

      await updateOrderDetail(
        { _id: detailId },
        {
          status: 'DONE',
          receivedDate: moment().toDate(),
        }
      );

      if (moment() > moment(order?.expiredAt))
        await updateUser({ _id: order?.user }, { isBlacklist: true });

      let count = await getOrderDetails({ order: id, status: 'PENDING' });

      if (count.length === 0)
        await updateOrder(
          { _id: id },
          {
            status: moment() > moment(order!.expiredAt) ? 'OVER' : 'DONE',
          }
        );

      order = await getOrder({ _id: order?._id });

      const details = await getOrderDetails({ order: order!._id }, { populate: { path: 'book' } });

      (order as any).details = details;

      return CreatedResponse(res, order);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default orderController;

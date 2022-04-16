import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { moment } from '../../configs/moment';
import { BadRequestResponse, CreatedResponse, ErrorResponse, SuccessResponse } from '../../helpers';
import { IBook } from '../../models/Book';
import { IOrder } from '../../models/Order';
import { getCard } from '../../services/card.service';
import { createOrder, getOrder, getOrders, updateOrder } from '../../services/order.service';
import {
  createOrderDetail,
  getOrderDetail,
  getOrderDetails,
  updateOrderDetail,
} from '../../services/orderDetail.service';
import { getRule } from '../../services/rule.service';

const orderController = {
  async get(_: Request, res: Response) {
    try {
      const orders = await getOrders();

      for (let order of orders) {
        const details = await getOrderDetails({ order: order._id }, { populate: { path: 'book' } });

        (order as any).details = details;
      }

      return SuccessResponse(res, orders);
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

      let card = await getCard({ user: body.user });

      if (!card) return BadRequestResponse(res, 'Người dùng chưa có thẻ');

      if (moment(card.expiredAt) < moment()) return BadRequestResponse(res, 'Thẻ đã hết hạn');

      let orders = await getOrders({ user: body.user, status: 'PENDING' });
      let count = 0;

      for (let order of orders) {
        let orderDetail = await getOrderDetails({ order: order._id, status: 'PENDING' });

        count += orderDetail.length;
      }

      if (rule && count + body.books.length > rule.maxBook)
        return BadRequestResponse(res, 'Số sách mượn vượt quá giới hạn');

      if (rule) body.expiredAt = moment().add(rule.maxDate, 'day').toDate();

      let order = await createOrder(body);
      let orderDetails: any[] = [];

      for (let book of body.books) {
        let orderDetail = await createOrderDetail({
          book: book,
          order: order?._id,
        });

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

      if (!order) return ErrorResponse(res, 'Tạo không thành công');

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
        return BadRequestResponse(res, 'Ngày vượt quá giới hạn');

      let order = await updateOrder({ _id: id }, body);

      return CreatedResponse(res, order);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async doneDetail(req: Request, res: Response) {
    let { id, detailId } = req.params;

    try {
      let detail = await getOrderDetail({ _id: detailId });
      let order = await getOrder({ _id: id });

      if (detail && detail.status === 'DONE') return BadRequestResponse(res, 'Phiếu đã được trả');

      detail = await updateOrderDetail(
        { _id: detailId },
        {
          status: 'DONE',
          receivedDate: moment().toDate(),
        }
      );

      let details = await getOrderDetails({ order: id, status: 'PENDING' });

      if (details.length === 0)
        await updateOrder(
          { _id: id },
          {
            status: moment() > moment(order!.expiredAt) ? 'OVER' : 'DONE',
          }
        );

      return CreatedResponse(res, order);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default orderController;

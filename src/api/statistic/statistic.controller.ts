import { Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../../helpers';
import { getBook } from '../../services/book.service';
import { getStatisticBooks, getStatisticUsers } from '../../services/statistic.service';
import { getUser } from '../../services/user.service';

const statisticController = {
  async getBooks(req: Request, res: Response) {
    try {
      const { limit, sort } = req.query;

      const books = await getStatisticBooks(Number(limit), Number(sort) as 1 | -1);

      for (let item of books) {
        const book = await getBook(
          { _id: item._id },
          { populate: [{ path: 'category' }, { path: 'language' }, { path: 'publisher' }] }
        );

        item = Object.assign(item, book);
      }

      return SuccessResponse(res, books);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async getUsers(req: Request, res: Response) {
    try {
      const { limit, sort } = req.query;

      const users = await getStatisticUsers(Number(limit), Number(sort) as 1 | -1);

      for (let item of users) {
        const user = await getUser(
          {},
          {
            select: '-password',
          }
        );

        item = Object.assign(item, user);
      }

      return SuccessResponse(res, users);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },
};

export default statisticController;

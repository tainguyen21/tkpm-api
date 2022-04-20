import { IBook } from './../../models/Book';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { CreatedResponse, ErrorResponse, NotFoundResponse, SuccessResponse } from '../../helpers';
import { createBook, deleteBook, getBook, getBooks, updateBook } from '../../services/book.service';
import { FilterQuery } from 'mongoose';
import { moment } from '../../configs/moment';

const bookController = {
  async get(req: Request, res: Response) {
    try {
      const query: FilterQuery<IBook> = {};

      if (req.query.name) {
        query.name = new RegExp(req.query.name as string, 'i');
      }

      if (req.query.category) {
        query.category = req.query.category;
      }

      if (req.query.publishDate) {
        query.publishDate = req.query.publishDate;
      }

      if (req.query.authorName) {
        query.authorName = new RegExp(req.query.authorName as string, 'i');
      }

      if (req.query.description) {
        query.description = new RegExp(req.query.description as string, 'i');
      }

      if (req.query.language) {
        query.language = req.query.language;
      }

      if (req.query.publisher) {
        query.publisher = req.query.publisher;
      }

      const books = await getBooks(query, {
        populate: [
          {
            path: 'category',
          },
          {
            path: 'language',
          },
          {
            path: 'publisher',
          },
        ],
      });

      return SuccessResponse(res, books);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<IBook>;
    try {
      body.publishDate = moment(body.publishDate).startOf('day').toDate();

      let book = await createBook(body);

      if (!book) return ErrorResponse(res, 'Tạo không thành công');

      book = await getBook(
        { _id: book._id },
        {
          populate: [
            {
              path: 'category',
            },
            {
              path: 'language',
            },
            {
              path: 'publisher',
            },
          ],
        }
      );

      return CreatedResponse(res, book);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<IBook>;
    try {
      let book = await getBook({ _id: id });
      if (!book) return NotFoundResponse(res, 'Không tìm thấy sách');

      // if update service
      book = await updateBook({ _id: id }, body);

      return CreatedResponse(res, book);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async delete(req: Request, res: Response) {
    let id = req.params.id;
    try {
      let book = await deleteBook({ _id: id });

      return SuccessResponse(res, book);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default bookController;

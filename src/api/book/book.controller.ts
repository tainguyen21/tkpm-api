import { IBook } from './../../models/Book';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { CreatedResponse, ErrorResponse, NotFoundResponse, SuccessResponse } from '../../helpers';
import { createBook, deleteBook, getBook, getBooks, updateBook } from '../../services/book.service';

const bookController = {
  async get(_: Request, res: Response) {
    try {
      const books = await getBooks(
        {},
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

      return SuccessResponse(res, books);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<IBook>;
    try {
      let book = await createBook(body);

      if (!book) return ErrorResponse(res, 'Tạo không thành công');

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

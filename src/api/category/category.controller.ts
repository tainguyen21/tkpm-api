import { ICategory } from '../../models/Category';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { CreatedResponse, ErrorResponse, NotFoundResponse, SuccessResponse } from '../../helpers';
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategorys,
  updateCategory,
} from '../../services/category.service';

const categoryController = {
  async get(_: Request, res: Response) {
    try {
      const categorys = await getCategorys();

      return SuccessResponse(res, categorys);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<ICategory>;
    try {
      let category = await createCategory(body);

      if (!category) return ErrorResponse(res, 'Tạo không thành công');

      return CreatedResponse(res, category);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<ICategory>;
    try {
      let category = await getCategory({ _id: id });
      if (!category) return NotFoundResponse(res, 'Không tìm thấy ngôn ngữa');

      // if update service
      category = await updateCategory({ _id: id }, body);

      return CreatedResponse(res, category);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async delete(req: Request, res: Response) {
    let id = req.params.id;
    try {
      let category = await deleteCategory({ _id: id });

      return SuccessResponse(res, category);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default categoryController;

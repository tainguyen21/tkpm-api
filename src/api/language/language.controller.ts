import { ILanguage } from '../../models/Language';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { CreatedResponse, ErrorResponse, NotFoundResponse, SuccessResponse } from '../../helpers';
import {
  createLanguage,
  deleteLanguage,
  getLanguage,
  getLanguages,
  updateLanguage,
} from '../../services/language.service';

const languageController = {
  async get(_: Request, res: Response) {
    try {
      const languages = await getLanguages();

      return SuccessResponse(res, languages);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<ILanguage>;
    try {
      let language = await createLanguage(body);

      if (!language) return ErrorResponse(res, 'Tạo không thành công');

      return CreatedResponse(res, language);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<ILanguage>;
    try {
      let language = await getLanguage({ _id: id });
      if (!language) return NotFoundResponse(res, 'Không tìm thấy ngôn ngữa');

      // if update service
      language = await updateLanguage({ _id: id }, body);

      return CreatedResponse(res, language);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async delete(req: Request, res: Response) {
    let id = req.params.id;
    try {
      let language = await deleteLanguage({ _id: id });

      return SuccessResponse(res, language);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default languageController;

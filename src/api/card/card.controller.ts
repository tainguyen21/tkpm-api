import { ICard } from '../../models/Card';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { CreatedResponse, ErrorResponse, NotFoundResponse, SuccessResponse } from '../../helpers';
import { createCard, deleteCard, getCard, getCards, updateCard } from '../../services/card.service';

const cardController = {
  async get(_: Request, res: Response) {
    try {
      const cards = await getCards();

      return SuccessResponse(res, cards);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const cards = await getCard({ _id: req.params.id });

      return SuccessResponse(res, cards);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<ICard>;
    try {
      let card = await createCard(body);

      if (!card) return ErrorResponse(res, 'Tạo không thành công');

      return CreatedResponse(res, card);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<ICard>;
    try {
      let card = await getCard({ _id: id });
      if (!card) return NotFoundResponse(res, 'Không tìm thấy ngôn ngữa');

      // if update service
      card = await updateCard({ _id: id }, body);

      return CreatedResponse(res, card);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async delete(req: Request, res: Response) {
    let id = req.params.id;
    try {
      let card = await deleteCard({ _id: id });

      return SuccessResponse(res, card);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default cardController;

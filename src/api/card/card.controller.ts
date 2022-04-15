import { ICard } from '../../models/Card';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import {
  BadRequestResponse,
  CreatedResponse,
  ErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from '../../helpers';
import { createCard, deleteCard, getCard, getCards, updateCard } from '../../services/card.service';
import { getRule } from '../../services/rule.service';
import { moment } from '../../configs/moment';

const cardController = {
  async get(_: Request, res: Response) {
    try {
      const cards = await getCards(
        {},
        {
          populate: {
            path: 'user',
          },
        }
      );

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
      let existedCard = await getCard({ user: body.user });

      if (existedCard) return BadRequestResponse(res, 'Người dùng đã có thẻ');

      let rule = await getRule();

      if (rule) {
        body.expiredAt = moment().add(rule.maxCardDate, 'day').toDate();
      }

      let card = await createCard({
        user: body.user,
        expiredAt: body.expiredAt,
      });

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
      if (!card) return NotFoundResponse(res, 'Không tìm thấy thẻ');

      if (body.user) {
        delete body.user;
      }

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

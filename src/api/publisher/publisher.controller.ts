import { IPublisher } from './../../models/Publisher';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { CreatedResponse, ErrorResponse, NotFoundResponse, SuccessResponse } from '../../helpers';
import {
  createPublisher,
  deletePublisher,
  getPublisher,
  getPublishers,
  updatePublisher,
} from '../../services/publisher.service';

const publisherController = {
  async get(_: Request, res: Response) {
    try {
      const publishers = await getPublishers();

      return SuccessResponse(res, publishers);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<IPublisher>;
    try {
      let publisher = await createPublisher(body);

      if (!publisher) return ErrorResponse(res, 'Tạo không thành công');

      return CreatedResponse(res, publisher);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<IPublisher>;
    try {
      let publisher = await getPublisher({ _id: id });
      if (!publisher) return NotFoundResponse(res, 'Không tìm thấy sách');

      // if update service
      publisher = await updatePublisher({ _id: id }, body);

      return CreatedResponse(res, publisher);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async delete(req: Request, res: Response) {
    let id = req.params.id;
    try {
      let publisher = await deletePublisher({ _id: id });

      return SuccessResponse(res, publisher);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default publisherController;

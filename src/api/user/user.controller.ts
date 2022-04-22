import { Request, Response } from 'express';
import { UpdateInput } from '../../common/interfaces';
import {
  BadRequestResponse,
  CreatedResponse,
  ErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from '../../helpers';
import { deleteUser, getUser, getUsers, updateUser } from '../../services/user.service';
import { IUser } from './../../models/User';

const userController = {
  async get(_: Request, res: Response) {
    try {
      const users = await getUsers();

      return SuccessResponse(res, users);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<IUser>;

    try {
      let user = await getUser({ _id: id });
      if (!user) return NotFoundResponse(res, 'Không tìm thấy người dùng');

      if (body.phone && (await getUser({ phone: body.phone }))) {
        return BadRequestResponse(res, 'Số điện thoại đã được đăng ký');
      }

      user = await updateUser({ _id: id }, body);

      return CreatedResponse(res, user);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async delete(req: Request, res: Response) {
    let id = req.params.id;
    try {
      let user = await deleteUser({ _id: id });

      return SuccessResponse(res, user);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default userController;

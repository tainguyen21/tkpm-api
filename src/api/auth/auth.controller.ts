import { Request, Response } from 'express';
import {
  BadRequestResponse,
  check,
  createToken,
  ErrorResponse,
  hash,
  SuccessResponse,
} from '../../helpers';
import { IUser } from '../../models/User';
import { createUser, getUser } from '../../services/user.service';

const authController = {
  async login(req: Request, res: Response) {
    const data = req.body as IUser;

    if (!data.phone && !data.password)
      return BadRequestResponse(res, 'Vui lòng điền đầy đủ thông tin');

    try {
      const user = await getUser({ phone: data.phone }, {}, true);

      if (!user) return BadRequestResponse(res, 'Không tìm thấy số điện thoại');

      if (await check(data.password, user.password)) {
        const { password, ...userInfo } = user;

        const accessToken = await createToken(userInfo, process.env.SECRET_KEY!, '14d');
        return SuccessResponse(res, { user: userInfo, accessToken });
      }

      return BadRequestResponse(res, 'Mật khẩu không chính xác');
    } catch (e) {
      return ErrorResponse(res, 'Hệ thống đang bảo trì');
    }
  },

  async register(req: Request, res: Response) {
    const data = req.body as IUser;

    if (!data.phone && !data.password)
      return BadRequestResponse(res, 'Vui lòng điền đầy đủ thông tin');

    try {
      const existed = await getUser({ phone: data.phone });

      if (existed) return BadRequestResponse(res, 'Số điện thoại đã được sử dụng');

      data.password = await hash(data.password);

      const user = await createUser(data);

      const accessToken = await createToken(user, process.env.SECRET_KEY!, '14d');

      return SuccessResponse(res, { user, accessToken });
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, 'Hệ thống đang bảo trì');
    }
  },
};

export default authController;

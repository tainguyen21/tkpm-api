import { Request, Response, NextFunction } from 'express';
import { ForbiddenResponse, NotFoundResponse, UnauthorizedResponse } from '../helpers';
import { getUser } from '../services/user.service';

export const adminRole = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return UnauthorizedResponse(res);

  let user = await getUser({ _id: (req.user as any)._id });

  if (!user) return NotFoundResponse(res, 'Không tìm thấy người dùng');

  if (!user.isAdmin) return ForbiddenResponse(res);

  return next();
};

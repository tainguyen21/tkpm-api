import { IRule } from './../../models/Rule';
import { Request, Response } from 'express';
import { CreateInput, UpdateInput } from '../../common/interfaces';
import { CreatedResponse, ErrorResponse, NotFoundResponse, SuccessResponse } from '../../helpers';
import { createRule, deleteRule, getRule, getRules, updateRule } from '../../services/rule.service';

const ruleController = {
  async get(_: Request, res: Response) {
    try {
      const rules = await getRules();

      return SuccessResponse(res, rules);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async post(req: Request, res: Response) {
    let body = req.body as CreateInput<IRule>;
    try {
      let rule = await createRule(body);

      if (!rule) return ErrorResponse(res, 'Tạo không thành công');

      return CreatedResponse(res, rule);
    } catch (e: any) {
      return ErrorResponse(res, e.message);
    }
  },

  async put(req: Request, res: Response) {
    let id = req.params.id;
    let body = req.body as UpdateInput<IRule>;
    try {
      let rule = await getRule({ _id: id });
      if (!rule) return NotFoundResponse(res, 'Không tìm thấy sách');

      // if update service
      rule = await updateRule({ _id: id }, body);

      return CreatedResponse(res, rule);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },

  async delete(req: Request, res: Response) {
    let id = req.params.id;
    try {
      let rule = await deleteRule({ _id: id });

      return SuccessResponse(res, rule);
    } catch (e: any) {
      ErrorResponse(res, e.message);
    }
  },
};

export default ruleController;

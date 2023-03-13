import Joi, { ObjectSchema } from "joi";
import { NextFunction, Response, Request } from "express";
import Loggin from "../library/Loggin";
import {IAuthor} from "../models/Author";
import {IBook} from "../models/Book";

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, _next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
    } catch (error) {
      Loggin.error(error);
      return res.status(422).json({ error });
    }
  };
};


export const Schemas = {
  author: {
    create: Joi.object<IAuthor>({
      name: Joi.string().required()
    }),
    update: Joi.object<IAuthor>({
      name: Joi.string().required()
    })
  },
  book: {
    create: Joi.object<IBook>({
      author: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .required(),
      title: Joi.string()
      .required()
    }),
    update: Joi.object<IBook>({
      author: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
      .required(),
      title: Joi.string()
      .required()
    })
}
}

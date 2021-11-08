import { Request, Response, NextFunction } from 'express';
import { UserModel, User } from '../models/userModel';
import { asyncTryCatch } from '../utils/asyncTryCatch';
import { ResponseStatus } from '../utils/responseStatus';

export const signup = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm }: User = request.body;
    const newUser = await UserModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    response.status(201).json({
      status: ResponseStatus.SUCCESS,
      data: {
        user: newUser,
      },
    });
  }
);

import { Request, Response, NextFunction } from 'express';
import { UserModel, User } from '../models/userModel';
import { asyncTryCatch } from '../utils/asyncTryCatch';
import { ResponseStatus } from '../utils/responseStatus';

export const signup = asyncTryCatch(
  async (request: Request<User>, response: Response, next: NextFunction) => {
    const newUser = await UserModel.create(request.body);

    response.status(201).json({
      status: ResponseStatus.SUCCESS,
      data: {
        user: newUser,
      },
    });
  }
);

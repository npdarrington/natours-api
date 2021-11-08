import { Request, Response, NextFunction } from 'express';
import { UserModel, User } from '../models/userModel';
import { asyncTryCatch } from '../utils/asyncTryCatch';
import { ResponseStatus } from '../utils/responseStatus';
import jwt from 'jsonwebtoken';

export const signup = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm }: User = request.body;
    const newUser = await UserModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    });

    response.status(201).json({
      status: ResponseStatus.SUCCESS,
      token,
      data: {
        user: newUser,
      },
    });
  }
);

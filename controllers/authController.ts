import { Request, Response, NextFunction } from 'express';
import { UserModel, User } from '../models/userModel';
import { asyncTryCatch } from '../utils/asyncTryCatch';
import { ResponseStatus } from '../utils/responseStatus';
import jwt from 'jsonwebtoken';

import { AppErrorHandler } from '../utils/AppErrorHandler';

const signToken = (id: string): string => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

export const signup = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm }: User = request.body;
    const newUser = await UserModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = signToken(newUser._id);

    response.status(201).json({
      status: ResponseStatus.SUCCESS,
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(
        AppErrorHandler.invokeError('You must enter an email and password', 400)
      );
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || !(await user!.correctPassword(password, user!.password))) {
      return next(
        AppErrorHandler.invokeError('Incorrect email or password', 401)
      );
    }

    const token = signToken(user._id);
    response.status(200).json({
      status: ResponseStatus.SUCCESS,
      token,
    });
  }
);

export const verifyUserLoggedIn = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    let token;

    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        AppErrorHandler.invokeError(
          'You are not logged in! Please login to get access.',
          401
        )
      );
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === 'string') {
      return next(
        AppErrorHandler.invokeError(
          'This token could not be verified. Please login to get access.',
          401
        )
      );
    }

    const verifyUser = await UserModel.findById(decoded.id);

    if (!verifyUser) {
      return next(
        AppErrorHandler.invokeError(
          'The user belonging to that token no longer exist.',
          401
        )
      );
    }

    if (verifyUser.changedPasswordAfter(decoded.iat!)) {
      return next(
        AppErrorHandler.invokeError(
          'User recently changed password. Please log in again.',
          401
        )
      );
    }

    Object.assign(request, { user: verifyUser });
    next();
  }
);

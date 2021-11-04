import { Request, Response, NextFunction } from 'express';

type AsyncTryCatchReturn = (
  request: Request,
  response: Response,
  next: NextFunction
) => void;

export const asyncTryCatch = (fn: Function): AsyncTryCatchReturn => {
  return (request: Request, response: Response, next: NextFunction) => {
    fn(request, response, next).catch(next);
  };
};

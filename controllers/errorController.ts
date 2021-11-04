import { ErrorRequestHandler, Response } from 'express';
import { ResponseStatus } from '../utils/responseStatus';

type ErrorObject = {
  status: string;
  statusCode: number;
  error?: string;
  message: string;
  stack?: string;
};

const sendErrorDev = (error: ErrorObject, response: Response): void => {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: ErrorObject, response: Response): void => {
  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || ResponseStatus.ERROR;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, response);
  }
};

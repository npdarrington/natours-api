import { ErrorRequestHandler, Response } from 'express';
import { ResponseStatus } from '../utils/responseStatus';

type ErrorObject = {
  status: string;
  statusCode: number;
  error?: string;
  message: string;
  stack?: string;
  isOperational?: boolean;
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
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error(`Error: `, error);
    response.status(500).json({
      status: ResponseStatus.ERROR,
      message: 'Something went wrong on the server',
    });
  }
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

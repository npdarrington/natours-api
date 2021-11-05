import { ErrorRequestHandler, Response } from 'express';
import { AppErrorHandler } from '../utils/AppErrorHandler';
import { ResponseStatus } from '../utils/responseStatus';

type ErrorObject = {
  status: string;
  statusCode: number;
  error?: string;
  message: string;
  stack?: string;
  isOperational?: boolean;
  name?: string;
  path?: string;
  value?: string;
  errmsg?: string;
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
    response.status(500).json({
      status: ResponseStatus.ERROR,
      message: 'Something went wrong on the server',
    });
  }
};

const handleCastErrorDB = (error: ErrorObject): AppErrorHandler => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return AppErrorHandler.invokeError(message, 400);
};

const handleDuplicateFieldsDB = (error: ErrorObject): AppErrorHandler => {
  const value = error.errmsg!.match(/(["'])(\\?.)*?\1/)![0];
  const message = `Duplicate field value ${value}. Please use another value.`;
  return AppErrorHandler.invokeError(message, 400);
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next
): void => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || ResponseStatus.ERROR;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    let cloneError = { ...error };
    cloneError.name = error.name;
    cloneError.errmsg = error.errmsg;

    if (cloneError.name === 'CastError')
      cloneError = handleCastErrorDB(cloneError);
    if (cloneError.code === 11000)
      cloneError = handleDuplicateFieldsDB(cloneError);

    sendErrorProd(cloneError, response);
  }
};

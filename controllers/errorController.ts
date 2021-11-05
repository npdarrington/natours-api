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
  errors?: ValidationObject[];
};

interface ValidationObject {
  message: string;
  name: string;
  properties: { [key: string]: string | string[] };
  kind: string;
  path: string;
  value: string;
}

const sendErrorDev = (error: ErrorObject, response: Response): void => {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const contactSysAdmin = (): string => {
  return `Something went wrong. Contact System Administrator.`;
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
      message: contactSysAdmin(),
    });
  }
};

const handleCastErrorDB = (error: ErrorObject): AppErrorHandler => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return AppErrorHandler.invokeError(message, 400);
};

const handleDuplicateFieldsDB = (error: ErrorObject): AppErrorHandler => {
  if (error.errmsg) {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)![0];
    const message = `Duplicate field value ${value}. Please use another value.`;
    return AppErrorHandler.invokeError(message, 400);
  }
  return AppErrorHandler.invokeError(contactSysAdmin(), 500);
};

const handleValidationErrorDB = (error: ErrorObject): AppErrorHandler => {
  if (error.errors) {
    const errors = Object.values(error.errors).map((el) => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return AppErrorHandler.invokeError(message, 400);
  }
  return AppErrorHandler.invokeError(contactSysAdmin(), 500);
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
    if (cloneError.name === 'ValidationError')
      cloneError = handleValidationErrorDB(cloneError);

    sendErrorProd(cloneError, response);
  }
};

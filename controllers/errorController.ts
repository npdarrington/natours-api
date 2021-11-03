import { ErrorRequestHandler } from 'express';
import { ResponseStatus } from '../utils/responseStatus';

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || ResponseStatus.ERROR;
  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

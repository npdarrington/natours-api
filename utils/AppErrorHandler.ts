import { ResponseStatus } from './responseStatus';

export class AppErrorHandler extends Error {
  public static invokeError(
    message: string,
    statusCode: number
  ): AppErrorHandler {
    return new AppErrorHandler(message, statusCode);
  }
  public status: ResponseStatus;
  public isOperational: boolean;
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith('4')
      ? ResponseStatus.ERROR
      : ResponseStatus.FAILURE;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

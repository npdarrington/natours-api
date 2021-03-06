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
    super();
    this.status = `${statusCode}`.startsWith('4')
      ? ResponseStatus.FAILURE
      : ResponseStatus.ERROR;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

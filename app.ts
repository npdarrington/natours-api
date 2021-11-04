import express, { Request, Response, NextFunction } from 'express';

import { globalErrorHandler } from './controllers/errorController';
import { AppErrorHandler } from './utils/AppErrorHandler';
import tourRouter from './routes/tourRoutes';

export const app = express();
app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    AppErrorHandler.invokeError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});
app.use(globalErrorHandler);

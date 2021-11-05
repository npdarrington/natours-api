import { app } from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { AppErrorHandler } from './utils/AppErrorHandler';

process.on('uncaughtException', (error: Error): void => {
  console.log(`${error.name} - ${error.message}`);
  console.log('UNHANDLED EXCEPTION! Shutting down...');
  process.exit(1);
});

dotenv.config();
const dbConn: string | undefined = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD!
);

if (dbConn) {
  mongoose
    .connect(dbConn)
    .then(() => console.log('DB connection successful'))
    .catch((error: Error) => {
      AppErrorHandler.invokeError(
        `The database did not connect. Contact System Admin.`,
        500
      );
    });
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App running on Port ${port}`)
);

process.on('unhandledRejection', (error: Error): void => {
  console.log(`${error.name} - ${error.message}`);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

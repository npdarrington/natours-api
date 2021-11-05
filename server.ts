import { app } from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const dbConn: string | undefined = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD!
);

if (dbConn) {
  mongoose.connect(dbConn).then(() => console.log('DB connection successful'));
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App running on Port ${port}`)
);

process.on('unhandledRejection', (error: Error) => {
  console.log(`${error.name} - ${error.message}`);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

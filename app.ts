import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.get('/', (request: Request, response: Response): void => {
  response.status(200).send('Hello from the server side!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on Port ${port}`));

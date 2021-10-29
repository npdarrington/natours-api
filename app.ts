import express from 'express';

import tourRouter from './routes/tourRoutes';

export const app = express();
app.use(express.json());

app.use('/api/v1/tours', tourRouter);

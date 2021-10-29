import fs from 'fs';
import { Request, Response } from 'express';

import { ResponseStatus } from '../utils/responseStatus';

interface SimpleTour {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
}

const tours: SimpleTour[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

export const getAllTours = (request: Request, response: Response) => {
  if (!tours.length) {
    response.status(500).json({
      status: ResponseStatus.FAILURE,
      message:
        'Something went wrong on the server. Please try again or contact system administrator.',
    });
  }

  response.status(200).json({
    status: ResponseStatus.SUCCESS,
    results: tours.length,
    data: {
      tours,
    },
  });
};

export const getTour = (request: Request, response: Response) => {
  const paramId = +request.params.id;
  const tour = tours.find((tour) => paramId === tour.id);

  if (!tour) {
    return response.status(404).send({
      status: ResponseStatus.FAILURE,
      message: 'Invalid ID',
    });
  }

  response.status(200).json({
    status: ResponseStatus.SUCCESS,
    results: 1,
    data: {
      tour,
    },
  });
};

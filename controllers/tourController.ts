import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import { ResponseStatus } from '../utils/responseStatus';
import { ErrorMessages } from '../utils/errorMessages';

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

export const validateID = (
  request: Request,
  response: Response,
  next: NextFunction,
  val: number
) => {
  if (!val || val > tours.length || val < 0) {
    return response.status(404).send({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.INVALID_ID,
    });
  }
  next();
};

export const getAllTours = (request: Request, response: Response) => {
  if (!tours.length) {
    response.status(500).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.SERVER_OFFLINE,
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
  const tour = tours.find((tour) => +request.params.id === tour.id);

  if (!tour) {
    response.status(404).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.TOUR_DOES_NOT_EXIST,
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

export const createTour = (request: Request, response: Response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return console.log('File was not written!');
      response.status(201).json({
        status: ResponseStatus.SUCCESS,
        data: {
          tour: newTour,
        },
      });
    }
  );
};

export const updateTour = (request: Request, response: Response) => {
  const tour = tours.find((tour) => +request.params.id === tour.id);

  if (!tour) {
    response.status(404).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.TOUR_DOES_NOT_EXIST,
    });
  }

  response.status(200).send({
    status: ResponseStatus.SUCCESS,
    data: {
      tour,
    },
  });
};

export const deleteTour = (request: Request, response: Response) => {
  const tour = tours.find((tour) => +request.params.id === tour.id);

  if (!tour) {
    response.status(404).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.TOUR_DOES_NOT_EXIST,
    });
  }

  response.status(204).send({
    status: ResponseStatus.SUCCESS,
    data: null,
  });
};

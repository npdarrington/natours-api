import { Request, Response, NextFunction } from 'express';

import { TourModel } from '../models/tourModel';

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

export const getAllTours = async (request: Request, response: Response) => {
  const tours = await TourModel.find();
  try {
    response.status(200).json({
      status: ResponseStatus.SUCCESS,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.SERVER_OFFLINE,
    });
  }
};

export const getTour = async (request: Request, response: Response) => {
  try {
    const tour = TourModel.findById(+request.params.id);
    response.status(200).json({
      status: ResponseStatus.SUCCESS,
      data: {
        tour,
      },
    });
  } catch (error) {
    response.status(404).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.TOUR_DOES_NOT_EXIST,
    });
  }
};

export const createTour = async (request: Request, response: Response) => {
  try {
    const tour = await TourModel.create(request.body);
    response.status(201).json({
      status: ResponseStatus.SUCCESS,
      data: {
        tour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.SERVER_OFFLINE,
    });
  }
};

export const updateTour = (request: Request, response: Response) => {};

export const deleteTour = (request: Request, response: Response) => {};

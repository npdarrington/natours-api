import { Request, Response, NextFunction } from 'express';

import { TourModel, Tour } from '../models/tourModel';
import { APIFeatures } from '../utils/APIFeatures';
import { asyncTryCatch } from '../utils/asyncTryCatch';
import { AppErrorHandler } from '../utils/AppErrorHandler';

import { ResponseStatus } from '../utils/responseStatus';

export const getAllTours = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const features = new APIFeatures<Tour>(TourModel.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    response.status(200).json({
      status: ResponseStatus.SUCCESS,
      results: tours.length,
      data: {
        tours,
      },
    });
  }
);

export const getTour = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const tour = await TourModel.findById(request.params.id);

    if (!tour) {
      return next(
        AppErrorHandler.invokeError(`No tour found with that ID`, 404)
      );
    }

    response.status(200).json({
      status: ResponseStatus.SUCCESS,
      data: {
        tour,
      },
    });
  }
);

export const createTour = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const tour = await TourModel.create(request.body);

    response.status(201).json({
      status: ResponseStatus.SUCCESS,
      data: {
        tour,
      },
    });
  }
);

export const updateTour = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const tour = await TourModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tour) {
      return next(
        AppErrorHandler.invokeError(`No tour found with that ID`, 404)
      );
    }

    response.status(200).json({
      status: ResponseStatus.SUCCESS,
      data: {
        tour,
      },
    });
  }
);

export const deleteTour = asyncTryCatch(
  async (request: Request, response: Response, next: NextFunction) => {
    const tour = await TourModel.findByIdAndDelete(request.params.id);

    if (!tour) {
      return next(
        AppErrorHandler.invokeError(`No tour found with that ID`, 404)
      );
    }

    response.status(200).json({
      status: ResponseStatus.SUCCESS,
    });
  }
);

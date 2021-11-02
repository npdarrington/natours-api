import { Request, Response } from 'express';

import { TourModel, Tour } from '../models/tourModel';
import { APIFeatures } from '../utils/ApiFeatures';

import { ResponseStatus } from '../utils/responseStatus';
import { ErrorMessages } from '../utils/errorMessages';

export const getAllTours = async (request: Request, response: Response) => {
  try {
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
  } catch (error) {
    response.status(500).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.SERVER_OFFLINE,
    });
  }
};

export const getTour = async (request: Request, response: Response) => {
  try {
    const tour = TourModel.findById(request.params.id);
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

export const updateTour = async (request: Request, response: Response) => {
  try {
    const tour = await TourModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    response.status(200).json({
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

export const deleteTour = async (request: Request, response: Response) => {
  try {
    const result = await TourModel.findByIdAndDelete(request.params.id);
    if (result) {
      response.status(204).json({
        status: ResponseStatus.SUCCESS,
      });
    } else {
      throw Error;
    }
  } catch (error) {
    response.status(400).json({
      status: ResponseStatus.FAILURE,
      message: ErrorMessages.SERVER_OFFLINE,
    });
  }
};

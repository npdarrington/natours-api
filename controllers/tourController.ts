import { Request, Response } from 'express';

import { TourModel } from '../models/tourModel';

import { ResponseStatus } from '../utils/responseStatus';
import { ErrorMessages } from '../utils/errorMessages';

export const getAllTours = async (request: Request, response: Response) => {
  try {
    //* Filtering query string
    const queryObj = { ...request.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //* Advanced Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = TourModel.find(JSON.parse(queryString));

    //* Sorting
    if (request.query.sort) {
      const convertQueryToString = request.query.sort as string;
      const sortBy = convertQueryToString.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const tours = await query;
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

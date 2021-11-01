import { Request, Response } from 'express';

import { TourModel } from '../models/tourModel';

import { ResponseStatus } from '../utils/responseStatus';
import { ErrorMessages } from '../utils/errorMessages';

const formatStringForQuery = (queryString: string): string => {
  return queryString.split(',').join(' ');
};

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
      const queryAsString = request.query.sort as string;
      const sortBy = formatStringForQuery(queryAsString);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //* Fields
    if (request.query.fields) {
      let fields = request.query.fields as string;
      fields += ',-__v';
      const parseString = formatStringForQuery(fields);
      query = query.select(parseString);
    } else {
      query = query.select('-__v');
    }

    //* Pagination
    if (request.query.page && request.query.limit) {
      const limit = +request.query.limit;
      const skip = (+request.query.page - 1) * limit;
      const numTours = await TourModel.countDocuments();

      if (skip >= numTours) throw new Error('This page does not exist');

      query = query.skip(skip).limit(limit);
    } else {
      query = query.limit(100);
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

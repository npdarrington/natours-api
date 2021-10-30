import fs from 'fs';
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

export const getAllTours = (request: Request, response: Response) => {};

export const getTour = (request: Request, response: Response) => {};

export const createTour = (request: Request, response: Response) => {};

export const updateTour = (request: Request, response: Response) => {};

export const deleteTour = (request: Request, response: Response) => {};

import express from 'express';
import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController';
import { verifyUserLoggedIn } from '../controllers/authController';

const router = express.Router();
router.route('/').get(verifyUserLoggedIn, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
export default router;

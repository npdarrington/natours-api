import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TourModel } from '../models/tourModel';

dotenv.config();

const dbConn = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD!
);

if (dbConn) {
  mongoose
    .connect(dbConn, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful'));
}

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

const importTours = async () => {
  try {
    await TourModel.create(tours);
    console.log('Tours successfully imported!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteAllTours = async () => {
  try {
    await TourModel.deleteMany({});
    console.log('Tours deleted successfully!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importTours();
}

if (process.argv[2] === '--delete') {
  deleteAllTours();
}

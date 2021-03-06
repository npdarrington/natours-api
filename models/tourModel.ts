import { Schema, model } from 'mongoose';
import slugify from 'slugify';

export interface Tour {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  createdAt: Date;
  startDates: Date[];
  slug: string;
}

const tourSchema = new Schema<Tour>({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal to 40 characters'],
    minlength: [10, 'A tour name must have more or equal to 10 characters'],
    validate: [
      /^[a-zA-Z\s]*$/,
      'A tour name can only contain letters and spaces',
    ],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, or difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'A tour rating must be 1 or higher'],
    max: [5, 'A tour rating must be below or equal to 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (this: { price: number }, value: number): boolean {
        return value < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
    select: false,
  },
  startDates: [Date],
  slug: String,
});

tourSchema.pre('save', function (next: Function) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export const TourModel = model<Tour>('Tour', tourSchema);

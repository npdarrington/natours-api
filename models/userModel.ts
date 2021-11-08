import { Schema, model } from 'mongoose';
import validator from 'validator';

export interface User {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm?: string;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A user must have a valid password'],
    trim: true,
    minlength: [8, 'A password must have a minimum of 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must verify their passwords match'],
    trim: true,
  },
});

export const UserModel = model<User>('User', userSchema);

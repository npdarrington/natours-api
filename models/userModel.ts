import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import validator from 'validator';

export interface User {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changedPasswordAfter: (JWTTimeStamp: number) => boolean;
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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must verify their passwords match'],
    trim: true,
    validate: {
      validator: function (this: { password: string }, value: string): boolean {
        return this.password === value;
      },
      message: 'The password and passwordConfirm fields must be the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next: Function) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

export const UserModel = model<User>('User', userSchema);

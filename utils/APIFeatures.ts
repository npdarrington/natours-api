import { Model } from 'mongoose';

export class APIFeatures<T extends Model<T>> {
  constructor(public query: T, public queryString: { [key: string]: string }) {}
}

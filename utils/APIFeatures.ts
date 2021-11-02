import { Query } from 'mongoose';
import { ParsedQs } from 'qs';

type QueryArgs = string | string[] | ParsedQs | ParsedQs[] | undefined;

export class APIFeatures<T> {
  constructor(
    public query: Query<T[], T>,
    public queryString: { [key: string]: QueryArgs }
  ) {}

  filter(): void {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let advFilter = JSON.stringify(queryObj);
    advFilter = advFilter.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query.find(JSON.parse(advFilter));
  }
}

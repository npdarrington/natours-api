import { Query } from 'mongoose';
import { ParsedQs } from 'qs';

type QueryArgs = string | string[] | ParsedQs | ParsedQs[] | undefined;

export class APIFeatures<T> {
  constructor(
    public query: Query<T[], T>,
    public queryString: { [key: string]: QueryArgs }
  ) {}

  filter(): APIFeatures<T> {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let advFilter = JSON.stringify(queryObj);
    advFilter = advFilter.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(advFilter));
    return this;
  }

  sort(): APIFeatures<T> {
    if (this.queryString.sort) {
      const queryAsString = this.queryString.sort as string;
      const sortBy = this.formatStringForQuery(queryAsString);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(): APIFeatures<T> {
    if (this.queryString.fields) {
      let fields = this.queryString.fields as string;
      const parseString = this.formatStringForQuery(fields);
      this.query = this.query.select(parseString);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate(): APIFeatures<T> {
    if (this.queryString.page && this.queryString.limit) {
      const limit = +this.queryString.limit;
      const skip = (+this.queryString.page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    } else {
      this.query = this.query.limit(100);
    }
    return this;
  }

  formatStringForQuery = (queryString: string): string => {
    return queryString.split(',').join(' ');
  };
}

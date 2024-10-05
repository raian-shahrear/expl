import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }

  // search query
  search(searchableField: string[]) {
    const searchTerm = this?.query?.searchTerm as string;
    if (searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: searchableField.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  // filter query
//   filter() {
//     const queryObj = { ...this.query };

//     const excludingFields = ['searchTerm', 'sort', 'limit', 'page'];
//     excludingFields.forEach((elm) => delete queryObj[elm]);

//     if (queryObj.minPrice || queryObj.maxPrice) {
//       const priceFilter: { $gte?: number; $lte?: number } = {};
//       if (queryObj.minPrice) priceFilter.$gte = Number(queryObj.minPrice);
//       if (queryObj.maxPrice) priceFilter.$lte = Number(queryObj.maxPrice);
//       queryObj.price = priceFilter;
//       delete queryObj.minPrice;
//       delete queryObj.maxPrice;
//     }
//     if (queryObj.services) {
//       const servicesArray = (queryObj.services as string)
//         .split(',')
//         .map((id) => id.trim());
//       queryObj._id = {
//         $in: servicesArray.map((id) => new mongoose.Types.ObjectId(id)),
//       };
//       delete queryObj.services;
//     }

//     this.queryModel = this.queryModel.find(queryObj as FilterQuery<T>);
//     return this;
//   }

  // sort query
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';

    this.queryModel = this.queryModel.sort(sort as string);
    return this;
  }

  // paginate query
  paginate() {
    const limit = Number(this?.query?.limit);
    const page = Number(this?.query?.page);
    const skip = (page - 1) * limit;

    this.queryModel = this.queryModel.skip(skip).limit(limit);
    return this;
  }

  async countTotal() {
    const totalQueries = this.queryModel.getFilter();
    const totalData = await this.queryModel.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page);
    const limit = Number(this?.query?.limit);
    const totalPage = Math.ceil(totalData / limit);

    return {
      page,
      limit,
      totalData,
      totalPage,
    };
  }
}

export default QueryBuilder;

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  sort() {
    const sortMapping = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    const sortKey = this.queryString.sort;

    if (sortKey && sortMapping[sortKey]) {
      this.query = this.query.sort(sortMapping[sortKey]);
    } else {
      this.query = this.query.sort(sortMapping["newest"]);
    }

    return this;
  }
}

module.exports = APIFeatures;

class APIFeatures {
  constructor(queryOrModel, queryString) {
    this.queryString = queryString;

    if (typeof queryOrModel.aggregate === "function") {
      this.model = queryOrModel;
      this.mode = "aggregate";
      this.pipeline = [];
    } else {
      this.query = queryOrModel;
      this.mode = "find";
    }
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    if (this.mode === "aggregate") {
      this.pipeline.push({ $skip: skip }, { $limit: limit });
    } else {
      this.query = this.query.skip(skip).limit(limit);
    }

    this.page = page;
    this.limit = limit;

    return this;
  }

  sort() {
    const sortKey = this.queryString.sort || "newest";

    const sortMapping = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      cheapest: { price: 1 },
      mostExpensive: { price: -1 },
    };

    const sortOption = sortMapping[sortKey] || sortMapping.newest;

    if (this.mode === "aggregate") {
      this.pipeline.push({ $sort: sortOption });
    } else {
      this.query = this.query.sort(sortMapping[sortKey]);
    }

    return this;
  }
  calculateStartingPrice() {
    if (this.mode !== "aggregate") return this;

    this.pipeline.push({
      $addFields: { price: { $min: "$volumes.price" }, volumes: "$$REMOVE" },
    });
    return this;
  }
}

module.exports = APIFeatures;

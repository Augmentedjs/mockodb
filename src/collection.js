const Result = require("./result.js");

class Collection {
  constructor(data) {
    this._data = data;
  };

  find(expression) {
    if (expression) {
      const found = this._where(expression);
      if (found) {
        return new Result(found);
      }
      return new Result([]);
    }
    return new Result(this._data);
  };

  findOne(expression) {
    if (expression) {
      return new Result(this._finderOne(expression).model);
    }
    throw new Error("No document");
  };

  async findOneAndUpdate(what, change, options) {
    if (what && change && change["$set"]) {
      const result = await this._finderOne(what);
      this._data[result.i] = await Object.assign(result.model, change["$set"]);
      return Promise.resolve(this._data[result.i]);
    }
    throw new Error("No document");
  };

  async insertOne(what) {
    if (what) {
      const model = await Object.create(what);
      await this._data.push(model);
      return Promise.resolve(model);
    }
    throw new Error("No document");
  };

  async insert(what) {
    if (what && Array.isArray(what)) {
      let i = 0;
      const l = what.length, items = [];
      for (i = 0; i < l; i++) {
        const model = await Object.create(what[i]);
        await this._data.push(model);
        await items.push(model);
      }
      return Promise.resolve(items);
    } else if (what && typeof what === "object") {
      return this.insertOne(what);
    }
    throw new Error("No document");
  };

  _where(constraint) {
    const collection = this._data;
    return collection.filter(collectionItem =>
      Object.keys(constraint).every(key =>
        collectionItem.hasOwnProperty(key) && constraint[key] === collectionItem[key]));
  };


  _finderOne(expression, first = true) {
    const collection = this._data;
    if (expression) {
      // take first object in expression, support more later
      const keys = Object.keys(expression);
      const key = keys[0], value = expression[key];

      let i = 0;
      const l = collection.length;

      for (i = 0; i < l; i++) {
        const model = collection[i];
        if (model[key] === value) {
          return { "index": i, "model": model };
        }
      }
    } else if (collection) {
      return collection;
    }
    return null;
  };
};

module.exports = Collection;

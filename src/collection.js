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
      const found = this._where(expression);
      if (found) {
        return Promise.resolve(found[0]);
      }
      return Promise.resolve({});
    }
    throw new Error("No document");
  };

  async findOneAndUpdate(what, change, options) {
    if (what && change && change["$set"]) {
      const iFound = this._whereIndex(what);

      if (iFound !== -1) {
        const model = this._data[iFound];
        // console.debug("found", iFound);

        this._data[iFound] = await Object.assign(model, change["$set"]);
        return Promise.resolve(this._data[iFound]);
      }
      return Promise.resolve({});
    }
    throw new Error("No document");
  };

  /* TODO: fix, does not work for multiples */
  async findAndUpdate(what, change, options) {
    if (what && change && change["$set"]) {
      const iFound = this._whereIndex(what);

      if (Array.isArray(iFound)) {
        let i = 0, list = [];
        const l = iFound.length;

        for (i = 0; i < l; i++) {
          const model = this._data[iFound[i]];
          // console.debug("found", i);
          this._data[iFound[i]] = await Object.assign(model, change["$set"]);
          list.push(this._data[iFound[i]]);
        }
        return Promise.resolve(list);
      } else if (iFound !== -1) {
        const model = this._data[iFound];
        // console.debug("found", iFound);
        this._data[iFound] = await Object.assign(model, change["$set"]);
        return Promise.resolve(this._data[iFound]);
      }
      return Promise.resolve({});
    }
    throw new Error("No document");
  };

  async insertOne(what) {
    if (what) {
      const model = await Object.assign({}, what);
      await this._data.push(model);
      return Promise.resolve(model);
    }
    throw new Error("No document");
  };

  async insert(what) {
    if (what && Array.isArray(what)) {
      await this._data.push(...what);
      return Promise.resolve(what);
    } else if (what && typeof what === "object") {
      return await this.insertOne(what);
    }
    throw new Error("No document");
  };

  async deleteOne(what) {
    if (what) {
      const iFound = this._whereIndex(what);

      if (iFound !== -1) {
        // const model = this._data[iFound];
        // console.debug("found", iFound);

        this._data.splice(iFound, 1);
        return Promise.resolve(null);
      }
      return Promise.resolve({});
    }
    throw new Error("No document");
  };

  async delete(what) {
    if (what) {
      const model = await Object.assign({}, what);
      const ii = await this._whereIndex(model);
      if (Array.isArray(ii)) {
        let i = 0;
        const l = ii.length;
        for (i = 0; i < l; i++) {
          this._data = await this._data.splice(ii[i], 1);
        }
        return Promise.resolve(ii);
      }
      return Promise.resolve({});
    }
    throw new Error("No document");
  };

  _where(constraint) {
    const collection = this._data;
    return collection.filter((collectionItem) =>
      Object.keys(constraint).every(key =>
        collectionItem.hasOwnProperty(key) && constraint[key] === collectionItem[key]));
  };

  _whereIndex(constraint) {
    const collection = this._data;
    return collection.findIndex((collectionItem) =>
      Object.keys(constraint).every(key =>
        collectionItem.hasOwnProperty(key) && constraint[key] === collectionItem[key]));
  };

  _finderOne(expression) {
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

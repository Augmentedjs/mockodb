// const finder = require("./finder.js");

class Result {
  constructor(data) {
    this._data = data;
  };

  toArray() {
    if (Array.isArray(this._data)) {
      return Promise.resolve(this._data);
    }
    const arr = [ this._data ];
    return Promise.resolve(arr);
  };
};

class Collection {
  constructor(data) {
    this._data = data;
  };

  find(what) {
    if (what) {
      return new Result(this._finderOne(what).model);
    }
    return new Result(this._data);
  };

  findOne(what) {
    if (what) {
      return new Result(this._finderOne(what).model);
    }
    return new Result(this._data);
  };

  async findOneAndUpdate(what, change, options) {
    if (what && change && change["$set"]) {
      const result = await this._finderOne(what);
      this._data[result.i] = await Object.assign(result.model, change["$set"]);
      return Promise.resolve(this._data[result.i]);
    }
    throw new Error("No document");
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

class MockoDB {
  constructor(options = {}) {
    this._databases = {};

    if (options.name && options.collections) {
      this._databases[options.name] = {
        collections: Object.create(options.collections)
      };
      /*
      const collections = this._databases[options.name].collections;

      let collection = null;
      for (collection in collections) {
        const c = collection;
        collections[c].find = (what) => {
          return finder(collections[c], what);
        }
        collections[c].insert = (row) => {
          collections[c].push(row);
          return row;
        }
        collections[c].update = (row, match) => {
          const i = collections[c].findIndex(element => row[match] === element[match]);
          if (i > -1) {
            collections[c][i] = row;
            return row;
          }
          return null;
        }
        collections[c].remove = (row, match) => {
          const i = collections[c].findIndex(element => row[match] === element[match]);
          if (i !== -1) {
            collections[c][i].splice(i, 1);
          }
          return row;
        }
      }
      */
    } else if (options.name) {
      this._databases[options.name] = {
        collections: {}
      };
    }
    this._name = (options.name) ? options.name : "untitled";
  };

  use(database) {
    if (database) {
      this._name = database;
    }
    return this;
  };

  get name() {
    return this._name;
  };

  // get db() {
  //   if (this._name) {
  //     return this._databases[this._name].collections;
  //   }
  //   return [];
  // };

  // get collections() {
  //   // console.debug("name", this._name, this._databases[this._name]);
  //   if (this._name) {
  //
  //     return this._databases[this._name].collections;
  //   }
  //   return [];
  // };

  collection(name, callback) {
    if (callback) {
      if (this._name && name) {
        const db = this._databases[this._name];
        if (db) {
          let collection = null;

          // console.debug("collections", db.collections);

          if (db.collections[name]) {
            collection = db.collections[name];
          } else {
            db.collections[name] = [];
            collection = db.collections[name];
          }

          return callback(null, new Collection(collection));

        } else {
          return callback(new Error("Missing database"), null);
        }
      }
      return callback(new Error("Missing name"), null);
    }
    throw new Error("Callback required");
  };

  // find(collection, what) {
  //   const c = this.collections[collection];
  //   if (what) {
  //     return findByMatchingProperties(c, what);
  //   }
  //   return c;
  // };
  //
  // update(collection, what) {
  //   const c = this.collections[collection];
  //   if (what) {
  //     return findByMatchingProperties(c, what);
  //   }
  //   return c;
  // };

  clear() {
    this._oldDB = null;
    this._oldDB = Object.create(this._db);
    this._db = Object.create({});
  };

};

module.exports = MockoDB;

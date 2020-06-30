const finder = (collection, expression) => {
  if (collection && expression) {
    // take first object in expression
    const keys = Object.keys(expression);
    const key = keys[0], value = expression[keys[0]];

    let i  = null;
    for (i in collection) {
      if (collection[i][key] == value) {
        return collection[i];
      }
    }
    return null;
  } else if (collection) {
    return collection;
  }
  return null;
};

class MockoDB {
  constructor(options = {}) {
    this._databases = {};

    if (options.name && options.collections) {
      this._databases[options.name] = {
        collections: Object.create(options.collections)
      };

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

    } else if (options.name) {
      this._databases[options.name] = {
        collections: {}
      };
    }
    this._name = (options.name) ? options.name : "untitled";
  };

  use(database) {
    this._name = database;
  };

  get name() {
    return this._name;
  };

  get db() {
    if (this._name) {
      return this._databases[this._name].collections;
    }
    return [];
  };

  get collections() {
    if (this._name) {
      return this._databases[this._name].collections;
    }
    return [];
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

const Collection = require("./collection.js");

class MockoDB {
  constructor(options = {}) {
    this._databases = {};
    this._name = (options.name) ? options.name : "untitled";
    this._databases[this.name] = {
      collections: (options.collections) ? Object.create(options.collections) : {}
    };
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

  collection(name, callback) {
    if (callback) {
      if (this._name && name) {
        const db = this._databases[this._name];
        if (db) {
          // let collection = null;
          if (!db.collections[name]) {
            // collection = db.collections[name];
          // } else {
            db.collections[name] = [];
            // collection = db.collections[name];
          }
          return callback(null, new Collection(db.collections[name]));
        } else {
          return callback(new Error("Missing database"), null);
        }
      }
      return callback(new Error("Missing name"), null);
    }
    throw new Error("Callback required");
  };
};

module.exports = MockoDB;

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

module.exports = Result;

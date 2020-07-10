describe("Given a mock db", () => {
  let db;
  beforeEach(() => {
    db = new MockoDB({
      "name": "test",
      "collections": {
        "computers": [
          { "name": "Maggie", "type": "desktop", "brand": "custom", "year": 2016 },
          { "name": "Dellintosh", "type": "laptop", "brand": "Dell", "year": 2017 },
          { "name": "MacBook Pro", "type": "laptop", "brand": "Apple", "year": 2019 },
          { "name": "Jetson Nano", "type": "SoC", "brand": "Nvidia", "year": 2020 }
        ]
      }
    });
  });

  afterEach(() => {
    db = null;
  });

  it("can use a database name", async () => {
    const name = await db.use("bubba").name;
    expect(name).to.equal("bubba");
  });

  describe("can read existing data in collection", () => {
    it("can find all items in a collection", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find()
        .toArray()
        .catch((err) => {
          throw err;
        });
      });
      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal([]);
      expect(data[0].name).to.equal("Maggie");
    });

    it("can find one item by selection", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find({ "name": "MacBook Pro" })
        .toArray()
        .catch((err) => {
          throw err;
        });
      });
      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal([]);
      expect(data[0].name).to.equal("MacBook Pro");
    });

    it("can find several items by selection", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find({ "type": "laptop" })
        .toArray()
        .catch((err) => {
          throw err;
        });
      });
      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal([]);
      expect(data[0].name).to.equal("Dellintosh");
    });

    it("can change data with promise", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find({ "name": "MacBook Pro" })
        .toArray()
        .then((arr) => {
          arr[0].name = "tweety";
          return arr;
        })
        .catch((err) => {
          throw err;
        });
      });

      const list = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find()
        .toArray()
        .catch((err) => {
          throw err;
        });
      });

      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal([]);
      expect(data[0].name).to.equal("tweety");
      expect(list[2].name).to.equal("tweety");
    });
  });

  describe("can update data", () => {
    it("can change a model in the collection", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection.findOneAndUpdate(
          { "name": "MacBook Pro" },
          { $set: { "name": "Backlook Slow", "type": "slappop", "brand": "Sattle", "year": 1976 } },
          { upsert: true }
        );
      });

      const list = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find()
        .toArray()
        .catch((err) => {
          throw err;
        });
      });

      // console.debug("data", data);
      // console.debug("list", list);

      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal({});
      expect(data.name).to.equal("Backlook Slow");
      expect(list[2].name).to.equal("Backlook Slow");
    });

    xit("can change several models in the collection", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection.findAndUpdate(
          { "type": "laptop" },
          { $set: { "type": "tree" } },
          { upsert: true }
        );
      });

      const list = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find()
        .toArray()
        .catch((err) => {
          throw err;
        });
      });

      // console.debug("data", data);
      // console.debug("list", list);

      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal({});
      expect(data.name).to.equal("Backlook Slow");
    });
  });

  describe("can insert data", () => {
    it("can insert one item", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection.insertOne(
          { "name": "Backlook Slow", "type": "slappop", "brand": "Sattle", "year": 1976 });
      });

      const list = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find()
        .toArray()
        .catch((err) => {
          throw err;
        });
      });

      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal({});
      expect(data.name).to.equal("Backlook Slow");
      expect(list.length).to.equal(5);
    });

    it("can insert many items", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection.insert([
          { "name": "Backlook Slow", "type": "slappop", "brand": "Sattle", "year": 1976 },
          { "name": "Back Slow", "type": "pesttop", "brand": "Sattle", "year": 1980 }
        ]);
      });

      const list = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find()
        .toArray()
        .catch((err) => {
          throw err;
        });
      });

      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal([]);
      expect(data.length).to.equal(2);
      expect(list.length).to.equal(6);
    });
  });

  describe("can delete data", () => {
    it("can delete one item", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection.deleteOne({ "name": "MacBook Pro" });
      });

      const list = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find()
        .toArray()
        .catch((err) => {
          throw err;
        });
      });

      expect(data).to.be.null;
      // expect(data).to.deep.equal({});
      // expect(data.name).to.equal("Backlook Slow");
      expect(list.length).to.equal(3);
    });
  });
});

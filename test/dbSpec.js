describe("Given a mock db", () => {
  let db;
  beforeEach(() => {
    db = new MockoDB({
      "name": "test",
      "collections": {
        "computers": [
          { "name": "Maggie", "type": "desktop", "brand": "custom", "year": 2016 },
          { "name": "Dellintosh", "type": "laptop", "brand": "Dell", "year": 2017 },
          { "name": "Macbook Pro", "type": "laptop", "brand": "Apple", "year": 2019 },
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
        .find({ "name": "Macbook Pro" })
        .toArray()
        .catch((err) => {
          throw err;
        });
      });
      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal([]);
      expect(data[0].name).to.equal("Macbook Pro");
    });

    it("can change data with promise", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection
        .find({ "name": "Macbook Pro" })
        .toArray()
        .then((arr) => {
          arr[0].name = "tweety";
          return arr;
        })
        .catch((err) => {
          throw err;
        });
      });
      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal([]);
      expect(data[0].name).to.equal("tweety");
    });
  });

  describe("can update data", () => {
    it("can change a model in the collection", async () => {
      const data = await db.collection("computers", async (err, collection) => {
        if (err) {
          throw err;
        }
        return await collection.findOneAndUpdate(
          { "name": "Macbook Pro" },
          { $set: { "name": "Backlook Slow", "type": "slappop", "brand": "Sattle", "year": 1976 } },
          { upsert: true });
      });

      expect(data).to.not.be.undefined;
      expect(data).to.not.deep.equal({});
      expect(data.name).to.equal("Backlook Slow");
    });
  });

});

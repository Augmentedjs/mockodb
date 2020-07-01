const chai = require("chai");
global.chai = chai;
global.expect = chai.expect;

const MockoDB = require("../src/index.js");
global.MockoDB = MockoDB;

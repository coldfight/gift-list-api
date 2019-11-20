const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../../models/user");
const sequelize = require("../../libs/database");

const expect = chai.expect;
chai.use(chaiHttp);

describe("controllers/recipientController", () => {
  let server;
  before(() => {
    server = require("../../server");
  });
  after(() => {
    server.close();
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe("getRecipients()", () => {});

  describe("getRecipient()", () => {});

  describe("createRecipient()", () => {});

  describe("updateRecipient()", () => {});

  describe("deleteRecipient()", () => {});
});

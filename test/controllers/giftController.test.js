const chai = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const User = require("../../models/user");
const sequelize = require("../../libs/database");
const fixtures = require("../fixtures/controllers/giftController.fixtures");

const expect = chai.expect;
chai.use(chaiHttp);

describe("controllers/giftController", () => {
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

  describe("getGifts()", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).get("/api/gifts");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("returns list of gifts for authenticated user", async () => {
      // Fixtures
      const { user1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .get("/api/gifts")
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.be.an("array");
      expect(res.body)
        .to.be.an("array")
        .with.lengthOf(2);
      expect(
        res.body
          .map(g => g.userId) // get userIds
          .filter((v, i, a) => a.indexOf(v) === i) // remove duplicate ids
      ).to.have.members([1]);

      jwt.verify.restore();
    });
  });

  describe("getGift()", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).get("/api/gifts/1");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("returns 404 if trying to pull gift not belonging to authenticated user", async () => {
      const { user1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .get("/api/gifts/4")
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", "Gift does not exist");

      jwt.verify.restore();
    });

    it("returns the gift if it belongs to the authenticated user", async () => {
      const { user1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .get("/api/gifts/1")
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.have.property("id", 1);
      expect(res.body).to.have.property("name", "Gift A");

      jwt.verify.restore();
    });
  });

  describe("createGift()", () => {});

  describe("updateGift()", () => {});

  describe("deleteGift()", () => {});
});

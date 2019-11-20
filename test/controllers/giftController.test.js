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
    server = require("../testServer");
  });
  after(() => {
    server.close();
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe("GET /api/gifts", () => {
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

  describe("GET /api/gifts/:id", () => {
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

  describe("POST /api/gifts", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).post("/api/gifts");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("fails to create a gift if validation fails", async () => {
      const { user1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .post("/api/gifts")
        .send({})
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.have.property("message", "Validation failed.");
      expect(res.body)
        .to.have.property("data")
        .and.to.be.an("array");
      expect(
        res.body.data.map(i => i.param).filter((v, i, a) => a.indexOf(v) === i)
      ).to.have.members(["name", "price", "recipientId"]);

      jwt.verify.restore();
    });

    it("fails to create a gift if using recipient that does not exist for authenticated user", async () => {
      const { user1, recipient2 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .post("/api/gifts")
        .send({
          name: "Xbox One",
          price: 400,
          recipientId: recipient2.id
        })
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property("message", "Recipient does not exist.");

      jwt.verify.restore();
    });

    it("should create a gift for the authenticated user", async () => {
      const { user1, recipient1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .post("/api/gifts")
        .send({
          name: "Xbox One",
          price: 400,
          recipientId: recipient1.id
        })
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.have.keys([
        "bought",
        "id",
        "name",
        "price",
        "recipientId",
        "userId",
        "updatedAt",
        "createdAt"
      ]);
      expect(res.body).to.have.property("recipientId", recipient1.id);
      expect(res.body).to.have.property("userId", user1.id);
      expect(res.body).to.have.property("name", "Xbox One");

      jwt.verify.restore();
    });
  });

  describe("PATCH /api/gifts/:id", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).patch("/api/gifts/1");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });
  });

  describe("deleteGift()", () => {});
});

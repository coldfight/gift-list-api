const chai = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const User = require("../../models/user");
const sequelize = require("../../libs/database");
const fixtures = require("../fixtures/recipients.fixtures");

const expect = chai.expect;
chai.use(chaiHttp);

describe("controllers/recipientController", () => {
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

  describe("GET /api/recipients", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).get("/api/recipients");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("returns list of recipients for authenticated user", async () => {
      // Fixtures
      const { user1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .get("/api/recipients")
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.be.an("array");
      expect(res.body)
        .to.be.an("array")
        .with.lengthOf(1);
      expect(
        res.body
          .map(r => r.userId) // get userIds
          .filter((v, i, a) => a.indexOf(v) === i) // remove duplicate ids
      ).to.have.members([1]);

      jwt.verify.restore();
    });

    it("should only return list of recipients specified by ID for authenticated user", async () => {
      // Fixtures
      const {
        user1,
        recipient1,
        recipient2,
        recipient3,
        recipient4
      } = await fixtures.set2();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .get(
          `/api/recipients?ids=${recipient1.id},${recipient2.id},${recipient4.id}`
        )
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.be.an("array");
      expect(res.body)
        .to.be.an("array")
        .with.lengthOf(1);
      expect(
        res.body.map(r => r.id)
      ).to.have.members([1]);

      jwt.verify.restore();
    });
  });

  describe("GET /api/recipients/:id", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).get("/api/recipients/1");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("returns 404 if trying to pull recipient not belonging to authenticated user", async () => {
      const { user1, recipient2 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .get("/api/recipients/" + recipient2.id)
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", "Recipient does not exist");

      jwt.verify.restore();
    });

    it("returns the recipient if it belongs to the authenticated user", async () => {
      const { user1, recipient1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .get("/api/recipients/" + recipient1.id)
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.have.property("id", 1);
      expect(res.body).to.have.property("name", "Recipient A");

      jwt.verify.restore();
    });
  });

  describe("POST /api/recipients", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).post("/api/recipients");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("fails to create a recipient if validation fails", async () => {
      const { user1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .post("/api/recipients")
        .send({})
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.body).to.have.property("message", "Validation failed.");
      expect(res.body)
        .to.have.property("data")
        .and.to.be.an("array");
      expect(
        res.body.data.map(i => i.param).filter((v, i, a) => a.indexOf(v) === i)
      ).to.have.members(["name"]);

      jwt.verify.restore();
    });

    it("should create a recipient for the authenticated user", async () => {
      const { user1, recipient1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .post("/api/recipients")
        .send({
          name: "Another Recipient"
        })
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(201);
      expect(res.body).to.have.property("userId", user1.id);
      expect(res.body).to.have.property("name", "Another Recipient");

      jwt.verify.restore();
    });
  });

  describe("PATCH /api/recipients/:id", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).patch("/api/recipients/1");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("returns 404 if trying to update recipient that does not belong to authenticated user", async () => {
      const { user1, recipient2 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .patch("/api/recipients/" + recipient2.id)
        .send({
          name: "New Name"
        })
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", "Recipient does not exist");

      jwt.verify.restore();
    });

    it("returns error if validation fails", async () => {
      const { user1, recipient1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .patch("/api/recipients/" + recipient1.id)
        .send({
          name: ""
        })
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.have.property("message", "Validation failed.");
      expect(res.body).to.have.property("data");
      expect(res.body.data.map(i => i.param)).to.have.members(["name"]);

      jwt.verify.restore();
    });

    it("updates the recipient for the authenticated user", async () => {
      const { user1, recipient1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .patch("/api/recipients/" + recipient1.id)
        .send({
          name: "New Name"
        })
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(200);
      expect(res.body)
        .to.have.property("name", "New Name")
        .which.does.not.equal(recipient1.name);

      jwt.verify.restore();
    });
  });

  describe("DELETE /api/recipients/:id", () => {
    it("returns an error if user is not authenticated", async () => {
      const res = await chai.request(server).delete("/api/recipients/1");
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Not authenticated");
      expect(res.error).not.to.be.false;
    });

    it("returns a 404 if trying to delete a recipient not belonging to authenticated user", async () => {
      const { user1, recipient2 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .delete("/api/recipients/" + recipient2.id)
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", "Recipient does not exist");

      jwt.verify.restore();
    });

    it("deletes a recipient belonging to authenticated user", async () => {
      const { user1, recipient1 } = await fixtures.set1();

      // Stub out jwt.verify()
      sinon.stub(jwt, "verify");
      jwt.verify.returns({
        userId: user1.id
      });

      const res = await chai
        .request(server)
        .delete("/api/recipients/" + recipient1.id)
        .set("Authorization", "Bearer JWT_TOKEN");

      expect(res.statusCode).to.equal(204);

      jwt.verify.restore();
    });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../../models/user");
const sequelize = require("../../libs/database");

const expect = chai.expect;
chai.use(chaiHttp);

describe("controllers/authController", () => {
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

  describe("login()", () => {
    it("should return an error if validation errors exist", async () => {
      const res = await chai.request(server).post("/api/auth/login");

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.have.property("message", "Validation failed.");
      expect(res.body.data)
        .to.be.an("array")
        .with.length.greaterThan(0);
      expect(res.body.data.map(e => e.param)).to.have.members([
        "password",
        "username"
      ]);
      expect(res.error).not.to.be.false;
    });

    it("should return an error if user does not exist", async () => {
      const res = await chai
        .request(server)
        .post("/api/auth/login")
        .type("application/json")
        .send({ username: "fake", password: "fake" });

      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Incorrect credentials");
      expect(res.error).not.to.be.false;
    });

    it("should return an error if user exists but incorrect password", async () => {
      // Fixtures
      await User.create({
        username: "coldfight",
        password: "thisismypassword"
      });

      const res = await chai
        .request(server)
        .post("/api/auth/login")
        .type("application/json")
        .send({ username: "coldfight", password: "wrong password" });

      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property("message", "Incorrect credentials");
      expect(res.error).not.to.be.false;
    });

    it("should authenticate user and return JWT token", async () => {
      // Fixtures
      await User.create({
        username: "coldfight",
        password: "thisismypassword"
      });

      const res = await chai
        .request(server)
        .post("/api/auth/login")
        .type("application/json")
        .send({ username: "coldfight", password: "thisismypassword" });

      expect(res.statusCode).to.equal(200);
      expect(res.body)
        .to.have.property("token")
        .that.is.a("string");
      expect(res.body)
        .not.to.have.property("refreshToken")
        .that.is.a("string");
      expect(res.error).to.be.false;
    });

    it("should authenticate user and return both tokens", async () => {
      // Fixtures
      await User.create({
        username: "coldfight",
        password: "thisismypassword"
      });

      const res = await chai
        .request(server)
        .post("/api/auth/login")
        .type("application/json")
        .send({
          username: "coldfight",
          password: "thisismypassword",
          refresh: true
        });

      expect(res.statusCode).to.equal(200);
      expect(res.body)
        .to.have.property("token")
        .that.is.a("string");
      expect(res.body)
        .to.have.property("refreshToken")
        .that.is.a("string");
      expect(res.error).to.be.false;
    });
  });

  describe("signup()", () => {
    it("should return an error if validation errors exist", async () => {
      const res = await chai.request(server).post("/api/auth/signup");

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.have.property("message", "Validation failed.");
      expect(res.body.data)
        .to.be.an("array")
        .with.length.greaterThan(0);
      expect(
        res.body.data
          .map(e => e.param) // map to property names
          .filter((v, i, a) => a.indexOf(v) === i) // remove duplicates
      ).to.have.members(["password", "username"]);
      expect(res.error).not.to.be.false;
    });

    it("should return an error if user alreaday exists", async () => {
      // Fixtures
      await User.create({
        username: "coldfight",
        password: "thisismypassword"
      });

      const res = await chai
        .request(server)
        .post("/api/auth/signup")
        .type("application/json")
        .send({ username: "coldfight", password: "wrong password" });

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.have.property("message", "Validation failed.");
      expect(res.body.data)
        .to.be.an("array")
        .with.length.greaterThan(0);
      expect(res.body.data.map(e => e.msg)).to.have.members([
        "User already exists."
      ]);
      expect(res.error).not.to.be.false;
    });

    it("should create and authenticate user and return both tokens", async () => {
      const res = await chai
        .request(server)
        .post("/api/auth/signup")
        .type("application/json")
        .send({
          username: "coldfight",
          password: "thisismypassword",
          refresh: true
        });

      expect(res.statusCode).to.equal(201);
      expect(res.body)
        .to.have.property("token")
        .that.is.a("string");
      expect(res.body)
        .to.have.property("refreshToken")
        .that.is.a("string");
      expect(res.body)
        .to.have.property("userId")
        .that.is.a("number");
      expect(res.error).to.be.false;
    });
  });

  describe("token()", () => {
    it("returns a new JWT token", async() => {
      expect(false).to.equal(true, "Needs to be tested still")
    })
  });
});

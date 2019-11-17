const chai = require("chai");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/isAuthenticated");
const User = require("../../models/user");

const expect = chai.expect;

describe("middleware/isAuthenticated", () => {
  it("should return an error if no authorization header is present", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/gifts",
      headers: {}
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();

    await authMiddleware(req, res, next);
    expect(next.called).to.be.true;
    expect(next.args[0].length).to.equal(1);
    expect(next.args[0][0].statusCode).to.equal(401);
    expect(next.args[0][0].message).to.equal("Not authenticated");
  });

  it("should return an error if a badly formatted authorization header is present", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/gifts",
      headers: {
        Authorization: "asdsad"
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();

    await authMiddleware(req, res, next);
    expect(next.called).to.be.true;
    expect(next.args[0].length).to.equal(1);
    expect(next.args[0][0].statusCode).to.equal(401);
    expect(next.args[0][0].message).to.equal("jwt must be provided");
  });

  it("should return an error if a badly formatted jwt token is sent", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/gifts",
      headers: {
        Authorization: "Bearer dslfkjsdflksdjflkasdfj"
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();

    await authMiddleware(req, res, next);
    expect(next.called).to.be.true;
    expect(next.args[0].length).to.equal(1);
    expect(next.args[0][0].statusCode).to.equal(401);
    expect(next.args[0][0].message).to.equal("jwt malformed");
  });

  it("should return an error if user does not exist", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/gifts",
      headers: {
        Authorization: "Bearer dslfkjsdflksdjflkasdfj"
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();

    // Stub out jwt.verify()
    sinon.stub(jwt, "verify");
    jwt.verify.returns({
      userId: 1
    });

    // Stub out User.findByPk()
    sinon.stub(User, "findByPk");
    User.findByPk.returns(null);

    await authMiddleware(req, res, next);

    expect(jwt.verify.called).to.be.true;
    expect(User.findByPk.called).to.be.true;
    expect(next.called).to.be.true;
    expect(next.args[0].length).to.equal(1);
    expect(next.args[0][0].statusCode).to.equal(401);
    expect(next.args[0][0].message).to.equal("Not authenticated");

    // Reset stubs
    jwt.verify.restore();
    User.findByPk.restore();
  });

  it("should pass user object into request", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/gifts",
      headers: {
        Authorization: "Bearer dslfkjsdflksdjflkasdfj"
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();

    // Stub out jwt.verify()
    sinon.stub(jwt, "verify");
    jwt.verify.returns({
      userId: 1
    });

    // Stub out User.findByPk()
    sinon.stub(User, "findByPk");
    User.findByPk.returns({ userId: 1 });

    await authMiddleware(req, res, next);
    
    expect(jwt.verify.called).to.be.true;
    expect(User.findByPk.called).to.be.true;
    expect(next.called).to.be.true;
    expect(next.args[0].length).to.equal(0);
    expect(req).to.have.property("user");
    // Reset stubs
    jwt.verify.restore();
    User.findByPk.restore();
  });
});

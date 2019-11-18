const chai = require("chai");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");
const errorHandler = require("../../libs/errorHandler");
const User = require("../../models/user");
const authController = require("../../controllers/authController");

const expect = chai.expect;

// good reference resource: https://sinonjs.org/releases/latest/stubs/

describe("controllers/authController", () => {
  describe("login()", () => {
    it("should return an error if validation errors exist", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      const error = new Error("Test Error");
      error.statusCode = 403;
      sinon.stub(errorHandler, "getValidationErrors").returns(error);
      const next = sinon.spy();

      await authController.login(req, res, next);
      expect(next.called).to.be.true;
      expect(next.args[0].length).to.equal(1);
      expect(next.args[0][0].statusCode).to.equal(403);
      expect(next.args[0][0].message).to.equal("Test Error");

      errorHandler.getValidationErrors.restore();
    });

    it("should return an error if user does not exist", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      sinon.stub(errorHandler, "getValidationErrors").returns(false);
      const next = sinon.spy();

      sinon.stub(User, "findOne").returns(null);

      await authController.login(req, res, next);
      expect(next.called).to.be.true;
      expect(next.args[0].length).to.equal(1);
      expect(next.args[0][0].statusCode).to.equal(401);
      expect(next.args[0][0].message).to.equal("Incorrect credentials");

      errorHandler.getValidationErrors.restore();
      User.findOne.restore();
    });

    it("should return an error if invalid password", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      sinon.stub(errorHandler, "getValidationErrors").returns(false);
      const next = sinon.spy();

      const userStub = sinon.createStubInstance(User, {
        isPasswordValid: sinon.stub().returns(false)
      });
      sinon.stub(User, "findOne").returns(userStub);

      await authController.login(req, res, next);
      expect(next.called).to.be.true;
      expect(next.args[0].length).to.equal(1);
      expect(next.args[0][0].statusCode).to.equal(401);
      expect(next.args[0][0].message).to.equal("Incorrect credentials");

      errorHandler.getValidationErrors.restore();
      User.findOne.restore();
      userStub.restore();
    });
  });
});

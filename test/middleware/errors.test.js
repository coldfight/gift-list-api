const chai = require("chai");
const httpMocks = require("node-mocks-http");
const errorsMiddleware = require("../../middleware/errors");

const expect = chai.expect;

describe("middleware/errors", () => {
  describe("notFound()", () => {
    it("should return a status code of 404 with correct error message", () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      errorsMiddleware.notFound(req, res);
      expect(res._getStatusCode()).to.equal(404);
      expect(res._getJSONData()).to.have.property(
        "message",
        "This endpoint does not exist."
      );
    });
  });

  describe("fallback()", () => {
    it("should return correct status code and error message", () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      const error = new Error("Test error");
      error.statusCode = 403;
      error.data = { customField: "Custom Message" };

      errorsMiddleware.fallback(error, req, res);
      expect(res._getStatusCode()).to.equal(403);

      const data = res._getJSONData();
      expect(data).to.have.property("message", "Test error");
      expect(data)
        .to.have.property("data")
        .with.property("customField", "Custom Message");
    });
  });
});

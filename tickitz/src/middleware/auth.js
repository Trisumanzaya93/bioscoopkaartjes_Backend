const { request } = require("express");
const { response } = require("../helpers/wrapper");
const helperWrapper = require("../helpers/wrapper");
const jwt = require("jsonwebtoken");
const { login } = require("../modules/auth/authController");

module.exports = {
  authentication: (request, response, next) => {
    // const token = request.header("x-access-token");
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(response, 403, "Please login first", null);
    }

    token = token.split(" ")[1];
    jwt.verify(token, "RAHASIA", (error, payload) => {
      if (error) {
        return helperWrapper.response(response, 403, error, null);
      }
      const { id, email, role } = payload;
      request.userInfo = { id, email, role };

      next();
    });
  },
  isAdmin: (request, response, next) => {
    let { role } = request.userInfo;

    if (role !== "admin") {
      return helperWrapper.response(
        response,
        401,
        "You Can Not Access This Page !",
        null
      );
    }
    next();
  },
};

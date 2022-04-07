const { request } = require("express");
const { response } = require("../helpers/wrapper");
const helperWrapper = require("../helpers/wrapper");
const jwt = require("jsonwebtoken");
const { login } = require("../modules/auth/authController");
const redis = require("../config/redis");

module.exports = {
  authentication: async (request, response, next) => {
    // const token = request.header("x-access-token");
    try {
      let token = request.headers.authorization;
      if (!token) {
        return helperWrapper.response(
          response,
          403,
          "Please login first",
          null
        );
      }

      token = token.split(" ")[1];
      console.log(token);

      // proses pengecekan accessToken(token) di redis yg sudah di set
      // kalau datanya ada di Redis, makauser tidak dapat masuk (sudah logout)
      const checkRedis = await redis.get(`accessToken:${token}`);
      console.log(checkRedis);
      if (checkRedis) {
        return helperWrapper.response(
          response,
          403,
          "Your token is destroy please login again",
          null
        );
      }

      jwt.verify(token, "RAHASIA", (error, payload) => {
        if (error) {
          return helperWrapper.response(response, 403, error, null);
        }
        const { id, email, role } = payload;
        request.userInfo = { id, email, role };

        next();
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  isAdmin: (request, response, next) => {
    let { role } = request.userInfo;
    console.log(role);

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

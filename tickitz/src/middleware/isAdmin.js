const { request } = require("express");
const { response } = require("../helpers/wrapper");
const helperWrapper = require("../helpers/wrapper");

const checkRoleAdmin = (request, response, next) => {
  const { role } = request.userInfo;

  if (role !== "admin") {
    return helperWrapper.response(response, 401, "Can Not Access !", null);
  }
  next();
};

module.exports = checkRoleAdmin;

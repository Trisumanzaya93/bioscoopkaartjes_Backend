const express = require("express");

const Router = express.Router();

const usersController = require("./usersController");
const middlewareAuth = require("../../middleware/auth");
const middlewareProfileImage = require("../../middleware/uploadProfile");
// const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/:id",
  middlewareAuth.authentication,
  usersController.getDataUserByUserId
);
Router.patch(
  "/profile/:id",
  middlewareAuth.authentication,
  usersController.updateProfile
);
Router.patch(
  "/image/:id",
  middlewareAuth.authentication,
  middlewareProfileImage,
  usersController.updateImage
);
Router.patch(
  "/password",
  middlewareAuth.authentication,
  usersController.updatePassword
);

module.exports = Router;

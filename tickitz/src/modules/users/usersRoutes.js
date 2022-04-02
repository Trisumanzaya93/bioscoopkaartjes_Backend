const express = require("express");

const Router = express.Router();

const usersController = require("./usersController");
const middlewareProfileImage = require("../../middleware/uploadProfile");

Router.get("/:id", usersController.getDataUserByUserId);
Router.patch("/profile/:id", usersController.updateProfile);
Router.patch("/image/:id", middlewareProfileImage, usersController.updateImage);

module.exports = Router;

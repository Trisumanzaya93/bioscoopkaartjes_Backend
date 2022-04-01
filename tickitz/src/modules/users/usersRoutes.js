const express = require("express");

const Router = express.Router();

const usersController = require("./usersController");

Router.get("/:id", usersController.getDataUserByUserId);
Router.patch("/profile/:id", usersController.updateProfile);
Router.patch("/image/:id", usersController.updateImage);

module.exports = Router;

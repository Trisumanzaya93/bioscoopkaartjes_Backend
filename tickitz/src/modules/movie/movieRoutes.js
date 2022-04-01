const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");
const middlewareRedis = require("../../middleware/redis");
const { clearMovieRedis } = require("../../middleware/redis");
const middlewareUsers = require("../../middleware/isAdmin");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareUsers,
  middlewareRedis.getMovieRedis,
  movieController.getAllMovie
);

Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);

// login - cek token dulu
// middlewareUsers u/ cek role

Router.post(
  "/",
  middlewareUsers,
  middlewareUpload,
  movieController.createMovie
); // authentication isAdmin
Router.patch(
  "/:id",
  middlewareUsers,
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
); // authentication isAdmin
Router.delete("/:id", middlewareUsers, movieController.deleteMovie); // authentication isAdmin

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;

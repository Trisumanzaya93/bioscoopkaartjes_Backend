const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");
const middlewareRedis = require("../../middleware/redis");
const { clearMovieRedis } = require("../../middleware/redis");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  movieController.getAllMovie
);

Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);

// login - cek token dulu
// middlewareAuthor u/ cek role

Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareUpload,
  movieController.createMovie
); // authentication isAdmin
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareUpload,
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
); // authentication isAdmin
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  movieController.deleteMovie
); // authentication isAdmin

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;

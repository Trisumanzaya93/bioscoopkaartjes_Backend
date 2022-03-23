const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movieRoutes");
// const scheduleRoutes = require("../modules/schedule/scheduleRoutes");

Router.use("/movie", movieRoutes); // localhost:3001/movie/hello
// Router.use("/schedule", scheduleRoutes); //localhost:3001/schedule/hello

// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;

const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareRedis = require("../../middleware/redis");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/",
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.get(
  "/movie/:movieId",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleByMovieId
);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  scheduleController.createSchedule
);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;

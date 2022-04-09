const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.get(
  "/seatbooking",
  middlewareAuth.authentication,
  bookingController.getSeatBooking
);
Router.get(
  "/dashboard",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.getDashboardBooking
);
Router.patch(
  "/ticket/:id",
  middlewareAuth.authentication,
  bookingController.updateStatusBooking
);
Router.get(
  "/user/:userId",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get("/:id", bookingController.getBookingByIdBooking);
Router.post(
  "/midtrans-notification",
  bookingController.postMidtransNotification
);
// Router.delete("/:id", bookingController.deleteBooking);

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;

const connection = require("../../config/mysql");
/* eslint-disable no-unused-vars */
module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO booking SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  createSeat: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO bookingseat SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  // getSeatBooking: (queryString) =>
  //   new Promise((resolve, reject) => {
  //     let sqlQuery =
  //       "SELECT bookingseat.seat FROM `bookingseat` JOIN booking ON bookingseat.bookingId = booking.id WHERE booking.id = ?";

  //     // if (queryString) {
  //     //   sqlQuery +=
  //     //     "WHERE scheduleId = ? AND dateBooking =? AND timeBooking = ?";
  //     // }
  //     connection.query(sqlQuery, (error, result) => {
  //       if (!error) {
  //         resolve(result[0].total);
  //       } else {
  //         reject(new Error(error.sqlMessage));
  //       }
  //     });
  //   }),

  // getBookingByIdBooking: (id) =>
  //   new Promise((resolve, reject) => {
  //     connection.query(
  //       "SELECT booking.*, movie.name, movie.category FROM `booking` JOIN schedule ON booking.scheduleId = schedule.id JOIN movie ON schedule.movieId = movie.id WHERE booking.id =?",
  //       id,
  //       (error, result) => {
  //         if (!error) {
  //           resolve(result);
  //         } else {
  //           reject(new Error(error.sqlMessage));
  //         }
  //       }
  //     );
  //   }),
  updateStatusBooking: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Promise(error.sqlMessage));
          }
        }
      );
    }),
};

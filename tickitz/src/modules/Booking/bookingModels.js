const { request } = require("express");
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
      console.log(data);
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

  getBookingByIdBooking: (id) =>
    new Promise((resolve, reject) => {
      let querySql =
        "SELECT booking.*, bookingseat.seat, bookingseat.createdAt, bookingseat.updatedAt, movie.name, movie.category FROM `booking` INNER JOIN schedule ON booking.scheduleId = schedule.id INNER JOIN movie ON schedule.movieId = movie.id INNER JOIN bookingseat ON bookingseat.bookingId = booking.id WHERE booking.id = ?";

      connection.query(querySql, id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getSeatBooking: (data) =>
    new Promise((resolve, reject) => {
      const sqlQuery =
        "SELECT bookingseat.seat FROM `bookingseat` JOIN booking ON bookingseat.bookingId = booking.id WHERE scheduleId = ? AND dateBooking = ? AND timeBooking = ?";

      // if (queryString) {
      //   sqlQuery +=
      //     "WHERE scheduleId = ? AND dateBooking =? AND timeBooking = ?";
      // }
      connection.query(sqlQuery, seat, (error, result) => {
        if (!error) {
          resolve(result[0].total);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getDashboardBooking: (month) =>
    new Peomise((resolve, reject) => {
      const query =
        "SELECT MONTH (createdAt) AS Month, SUM(totalPayment) AS total FROM `booking` GROUP BY MONTH (createdAt)";

      connection.query(sqlQuery, month, (error, result) => {
        if (!error) {
          resolve(result[0].total);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  updateStatusBooking: (id) =>
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

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
            console.log("newresult", newResult);
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

  getBookingByUserId: (userId) =>
    new Promise((resolve, reject) => {
      let querySql =
        "SELECT booking.*," +
        "bookingseat.seat, bookingseat.createdAt, bookingseat.updatedAt," +
        " movie.name, movie.category FROM `booking`" +
        "INNER JOIN schedule ON booking.scheduleId = schedule.id INNER JOIN movie ON schedule.movieId = movie.id " +
        "INNER JOIN bookingseat ON bookingseat.bookingId = booking.id " +
        "WHERE booking.userId = ? ";

      connection.query(querySql, [userId], (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getBookingByIdBooking: (id) =>
    new Promise((resolve, reject) => {
      let querySql =
        "SELECT booking.*, " +
        "bookingseat.seat, bookingseat.createdAt, bookingseat.updatedAt," +
        "movie.name, movie.category FROM `booking`" +
        "INNER JOIN schedule ON booking.scheduleId = schedule.id INNER JOIN movie ON schedule.movieId = movie.id " +
        "INNER JOIN bookingseat ON bookingseat.bookingId = booking.id " +
        "WHERE booking.id = ?";

      connection.query(querySql, id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      const sqlQuery =
        "SELECT bookingseat.seat FROM `bookingseat` JOIN booking ON bookingseat.bookingId = booking.id WHERE scheduleId = ? AND dateBooking = ? AND timeBooking = ?";

      connection.query(
        sqlQuery,
        [scheduleId, dateBooking, timeBooking],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getDashboardBooking: (scheduleId, movieId, location) =>
    new Promise((resolve, reject) => {
      const sqlQuery =
        "SELECT MONTH (createdAt) AS Month, SUM(totalPayment) AS total FROM `booking` GROUP BY MONTH (createdAt)";

      connection.query(
        sqlQuery,
        [scheduleId, movieId, location],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  updateStatusBooking: (id, data) =>
    new Promise((resolve, reject) => {
      const sqlQuery = "UPDATE booking SET ? WHERE id = ?";

      connection.query(sqlQuery, [data, id], (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Promise(error.sqlMessage));
        }
      });
    }),
};

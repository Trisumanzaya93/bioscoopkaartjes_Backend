const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getAllSchedule: (queryString) =>
    new Promise((resolve, reject) => {
      const query = {
        search: queryString.searchLocation ?? "",
        search: queryString.searchMovieId ?? "movieId",
      };
      let sqlQuery =
        "SELECT schedule.*, movie.id, movie.createdAt, movie.updatedAt, movie.name, movie.category, movie.director," +
        "movie.casts, movie.releaseDate, movie.duration, movie.synopsis FROM schedule INNER JOIN movie ON schedule.movieId = movie.id";

      let firstWhere = true;
      if (queryString.searchLocation) {
        sqlQuery += `${firstWhere ? "WHERE" : "AND"} (location like '%${
          queryString.searchLocation
        }%')`;
        firstWhere = false;
      }
      if (queryString.searchMovieId) {
        sqlQuery += `${firstWhere ? "WHERE" : "AND"} (movieId = ${
          queryString.searchMovieId
        })`;
        firstWhere = false;
      }
      if (query.sort) {
        sqlQuery += ` ORDER BY ${queryString.sort}`;
      }
      sqlQuery += ` LIMIT ${queryString.limit} OFFSET ${queryString.offset}`;

      connection.query(sqlQuery, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO schedule SET ?",
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
      console.log(query.sql);
    }),
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
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

  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      console.log(typeof id);
      connection.query(
        "DELETE FROM schedule WHERE id = ?",
        [id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
    }),
};

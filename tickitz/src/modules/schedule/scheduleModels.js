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
        search: queryString.search ?? "",
        sortBy: queryString.sortBy ?? "name",
      };
      let sqlQuery =
        "SELECT schedule.*, movie.createdAt, movie.updatedAt, movie.name, movie.category, movie.director, movie.cast, movie.releaseDate, movie.duration, movie.synopsis FROM schedule INNER JOIN movie ON movie.id = schedule.movieId";

      let firstWhere = true;
      if (query.search) {
        sqlQuery += `${firstWhere ? "WHERE" : "AND"} (location like '%${
          query.search
        }%' OR movieId like '%${query.search}%')`;
        firstWhere = false;
      }
      if (query.sort && query.sortBy) {
        sqlQuery += ` ORDER BY ${query.sortBy} ${query.sort}`;
      }

      sqlQuery += ` LIMIT ${queryString.limit} OFFSET ${queryString.offset}`;
      console.log(sqlQuery);

      connection.query(sqlQuery, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  // getAllSchedule: (queryString) =>
  //   new Promise((resolve, reject) => {
  //     let sqlQuery = "SELECT * FROM schedule ";

  //     let firstWhere = true;
  //     if (queryString.search) {
  //       sqlQuery += `${firstWhere ? "WHERE" : "AND"} (location like '%${
  //         queryString.search
  //       }%' OR movieId like '%${queryString.search}%')`;
  //       firstWhere = false;
  //     }
  //     if (queryString.sort && queryString.sortBy) {
  //       sqlQuery += ` ORDER BY ${queryString.sortBy} ${queryString.sort}`;
  //     }
  //     sqlQuery += ` LIMIT ${queryString.limit} OFFSET ${queryString.offset}`;

  //     connection.query(sqlQuery, (error, result) => {
  //       if (!error) {
  //         resolve(result);
  //       } else {
  //         reject(new Error(error.sqlMessage));
  //       }
  //     });
  //   }),

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

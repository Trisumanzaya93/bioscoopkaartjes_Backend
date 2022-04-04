/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const connection = require("../../config/mysql");

module.exports = {
  getCountMovie: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM movie",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getAllMovie: (queryString) =>
    new Promise((resolve, reject) => {
      const query = {
        search: queryString.search ?? "",
        sortBy: queryString.sortBy ?? "name",
      };
      let sqlQuery = "SELECT * FROM movie ";

      let firstWhere = true;
      if (queryString.search) {
        sqlQuery += `${firstWhere ? "WHERE" : "AND"} (name LIKE '%${
          queryString.search
        }%' OR category like '%${
          queryString.search
        }%' OR MONTH(releaseDate) LIKE '%${queryString.search}%')`;
        firstWhere = false;
      }

      // if (queryString.searchRelease = "" && queryString.searchRelease) {
      //   sqlQuery += ` ${firstWhere ? "WHERE" : "AND"} ( name LIKE = '%${
      //     queryString.searchRelease
      //   }%' AND MONTH(releaseDate) = ${queryString.searchRelease})`;
      //   firstWhere = false;
      // }

      if (queryString.sort && queryString.sortBy) {
        sqlQuery += ` ORDER BY ${queryString.sortBy} ${queryString.sort}`;
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

  getMovieById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie WHERE id = ?",
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

  createMovie: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO movie SET ?",
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

  updateMovie: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE movie SET ? WHERE id = ?",
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

  deleteMovie: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM movie WHERE id = ?",
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

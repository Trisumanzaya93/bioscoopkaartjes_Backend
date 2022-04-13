/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO user SET id = ?, firstName = ?, lastName = ?, email = ?, noTelp =?, password =?, pinActivation=? ",
        [
          data.id,
          data.firstName,
          data.lastName,
          data.email,
          data.noTelp,
          data.password,
          data.pinActivation,
        ],
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

  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email = ?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  updateStatus: (status, pinActivation) =>
    new Promise((resolve, reject) => {
      const querySql = "UPDATE user SET status = ? WHERE pinActivation = ? ";
      connection.query(querySql, [status, pinActivation], (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Promise(error.sqlMessage));
        }
      });
    }),
};

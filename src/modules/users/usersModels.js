// const { query } = require("../../config/mysql");
const connection = require("../../config/mysql");

module.exports = {
  getDataUserByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE id = ? ",
        id,
        (error, result) => {
          if (!error) {
            resolve(result[0]);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  //

  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      const querySql = "UPDATE user SET ? WHERE id = ? ";
      connection.query(querySql, [data, id], (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  updateImage: (id, data) =>
    new Promise((resolve, reject) => {
      const querySql = "UPDATE user SET ? WHERE id = ? ";
      connection.query(querySql, [data, id], (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  updatePassword: (email, password) => {
    return new Promise((resolve, reject) => {
      const querySql = "UPDATE user SET password = ?  WHERE email = ? ";
      connection.query(querySql, [password, email], (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    });
  },
};

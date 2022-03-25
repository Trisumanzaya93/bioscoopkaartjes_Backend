const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./scheduleModels");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(response, 200, "Success get data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  getScheduleById: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(response, 200, "Success get data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  createSchedule: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(response, 200, "Success create data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateSchedule: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(response, 200, "Success update data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  deleteSchedule: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(response, 200, "Success delete data !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};

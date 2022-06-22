/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable no-console */
const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const scheduleModel = require("./scheduleModels");
const authModels = require("../auth/authModels");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      const queryString = request.query;
      const limit = parseInt(queryString.limit ? queryString.limit : 3);
      const page = parseInt(queryString.page ? queryString.page : 1);
      const offset = parseInt(page * limit) - limit; // 1*3-3=0

      const result = await scheduleModel.getAllSchedule({
        ...queryString,
        limit,
        offset,
      });
      const totalData = await scheduleModel.getCountSchedule(queryString);

      const totalPage = Math.ceil(totalData / limit); // membulatkan ke atas: Math.ceil()
      const pageInfo = {
        offset,
        totalPage,
        limit,
        totalData,
        page: parseInt(queryString.page),
      };

      // PROSES UNTUK MENYIMPAN DATA KE REDIS
      // Method JSON.stringify() untuk mengubah objek javascript menjadi string JSON
      redis.setEx(`getSchedule: ${queryString}`, 3600, JSON.stringify(result));
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result,
        pageInfo
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null, error);
    }
  },

  getScheduleByMovieId: async (request, response) => {
    try {
      const { movieId } = request.params;
      const result = await scheduleModel.getScheduleByMovieId(movieId);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by movieId ${movieId} not found`,
          null
        );
      }
      // PROSES UNTUK MENYIMPAN DATA KE REDIS
      // Method JSON.stringify() untuk mengubah objek javascript menjadi string JSON
      redis.setEx(`getSchedule: ${movieId}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      // PROSES UNTUK MENYIMPAN DATA KE REDIS
      // Method JSON.stringify() untuk mengubah objek javascript menjadi string JSON
      redis.setEx(`getSchedule: ${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  createSchedule: async (request, response) => {
    try {
      const { movieId, premier, price, location, dateStart, dateEnd } =
        request.body;
      const setData = {
        movieId,
        premier,
        price,
        location,
        dateStart,
        dateEnd,
      };
      const result = await scheduleModel.createSchedule(request.body);
      return helperWrapper.response(response, 200, "Success create data !");
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", error);
    }
  },

  updateSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await scheduleModel.getScheduleById(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { movieId, premier, price, location, dateStart, dateEnd } =
        request.body;
      const setData = {
        movieId,
        premier,
        price,
        location,
        dateStart,
        dateEnd,
        updatedAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); //property
        // console.log(setData[data]); //value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await scheduleModel.updateSchedule(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null, error);
    }
  },

  deleteSchedule: async (request, response) => {
    const { id } = request.params;
    const newId = parseInt(id);
    try {
      const checkId = await scheduleModel.getScheduleById(newId);
      if (checkId.length === 0)
        return helperWrapper.response(response, 404, "Schedule not found !");

      await scheduleModel.deleteSchedule(newId);
      return helperWrapper.response(response, 200, "Success delete schedule !");
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};

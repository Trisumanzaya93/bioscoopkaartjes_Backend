/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable no-console */
const helperWrapper = require("../../helpers/wrapper");
const scheduleModel = require("./scheduleModels");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      const queryString = request.query;
      const limit = parseInt(queryString.per_page ?? 2);
      const offset = parseInt((queryString.page ?? 1) * limit) - limit; // 1*3-3=0

      const result = await scheduleModel.getAllSchedule({
        ...queryString,
        limit,
        offset,
      });
      const totalData = await scheduleModel.getCountSchedule();
      const totalPage = Math.ceil(totalData / limit); // membulatkan ke atas: Math.ceil()
      const pageInfo = {
        offset,
        totalPage,
        limit,
        totalData,
        page: parseInt(queryString.page),
      };

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
